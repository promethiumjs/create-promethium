#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";
import { blue, yellow, red, reset } from "kolorist";
const cwd = process.cwd();
const VARIANTS = [
    {
        name: "javascript",
        display: "JavaScript",
        color: yellow,
    },
    {
        name: "typescript",
        display: "TypeScript",
        color: blue,
    },
];
const renameFiles = {
    _gitignore: ".gitignore",
};
const defaultTargetDir = "promethium-app";
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const argTargetDir = formatTargetDir(process.argv[2]);
        let targetDir = argTargetDir || defaultTargetDir;
        const getProjectName = () => targetDir === "." ? path.basename(path.resolve()) : targetDir;
        let result;
        try {
            result = yield prompts([
                {
                    type: argTargetDir ? null : "text",
                    name: "projectName",
                    message: reset("Project Name:"),
                    onState: (state) => {
                        targetDir = formatTargetDir(state.value) || defaultTargetDir;
                    },
                },
                {
                    type: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm",
                    name: "overwrite",
                    message: () => (targetDir === "."
                        ? "Current directory"
                        : `Target directory "${targetDir}"`) +
                        ` is not empty. Remove existing files and continue?`,
                },
                {
                    type: (_, { overwrite }) => {
                        if (overwrite === false) {
                            throw new Error(red("✖") + " Operation cancelled");
                        }
                        return null;
                    },
                    name: "overwriteChecker",
                },
                {
                    type: () => (isValidPackageName(getProjectName()) ? null : "text"),
                    name: "packageName",
                    message: reset("Package name:"),
                    initial: () => toValidPackageName(getProjectName()),
                    validate: (dir) => isValidPackageName(dir) || "Invalid package.json name",
                },
                {
                    type: "select",
                    name: "variant",
                    message: reset("Select a variant:"),
                    choices: () => VARIANTS.map((variant) => {
                        const variantColor = variant.color;
                        return {
                            title: variantColor(variant.display || variant.name),
                            value: variant.name,
                        };
                    }),
                },
            ], {
                onCancel: () => {
                    throw new Error(red("✖") + " Operation cancelled");
                },
            });
        }
        catch (cancelled) {
            console.log(cancelled.message);
            return;
        }
        const { projectName, overwrite, packageName, variant } = result;
        const root = path.join(cwd, targetDir);
        if (overwrite) {
            emptyDir(root);
        }
        else if (!fs.existsSync(root)) {
            fs.mkdirSync(root, { recursive: true });
        }
        const template = variant;
        const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
        const pkgManager = pkgInfo ? pkgInfo.name : "npm";
        const isYarn1 = pkgManager === "yarn" && (pkgInfo === null || pkgInfo === void 0 ? void 0 : pkgInfo.version.startsWith("1."));
        console.log(`\nBootstrapping project in ${root}...`);
        const templateDir = path.resolve(fileURLToPath(import.meta.url), "..", `template-${template}`);
        const write = (file, content) => {
            var _a;
            const targetPath = path.join(root, (_a = renameFiles[file]) !== null && _a !== void 0 ? _a : file);
            if (content) {
                fs.writeFileSync(targetPath, content);
            }
            else {
                copy(path.join(templateDir, file), targetPath);
            }
        };
        const files = fs.readdirSync(templateDir);
        for (const file of files.filter((f) => f !== "package.json" && f !== "node_modules" && f !== "package-lock.json")) {
            write(file);
        }
        const pkg = JSON.parse(fs.readFileSync(path.join(templateDir, `package.json`), "utf-8"));
        pkg.name = packageName || getProjectName();
        write("package.json", JSON.stringify(pkg, null, 2));
        console.log(`\nDone. Now run:\n`);
        if (root !== cwd) {
            console.log(`  cd ${path.relative(cwd, root)}`);
        }
        switch (pkgManager) {
            case "yarn":
                console.log("  yarn");
                console.log("  yarn dev");
                break;
            default:
                console.log(`  ${pkgManager} install`);
                console.log(`  ${pkgManager} run dev`);
                break;
        }
        console.log();
    });
}
function formatTargetDir(targetDir) {
    return targetDir === null || targetDir === void 0 ? void 0 : targetDir.trim().replace(/\/+$/g, "");
}
function isValidPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}
function toValidPackageName(projectName) {
    return projectName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/^[._]/, "")
        .replace(/[^a-z\d\-~]+/g, "-");
}
function isEmpty(path) {
    const files = fs.readdirSync(path);
    return files.length === 0 || (files.length === 1 && files[0] === ".git");
}
function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const file of fs.readdirSync(dir)) {
        if (file === ".git") {
            continue;
        }
        fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
    }
}
function pkgFromUserAgent(userAgent) {
    if (!userAgent)
        return undefined;
    const pkgSpec = userAgent.split(" ")[0];
    const pkgSpecArr = pkgSpec.split("/");
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1],
    };
}
function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    }
    else {
        fs.copyFileSync(src, dest);
    }
}
function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}
init().catch((e) => {
    console.error(e);
});
