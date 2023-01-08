import {cwd as $gHeVW$cwd, argv as $gHeVW$argv} from "process";
import $gHeVW$nodefs from "node:fs";
import $gHeVW$nodepath from "node:path";
import {fileURLToPath as $gHeVW$fileURLToPath} from "node:url";
import $gHeVW$prompts from "prompts";
import {yellow as $gHeVW$yellow, blue as $gHeVW$blue, reset as $gHeVW$reset, red as $gHeVW$red} from "kolorist";







const $149c1bd638913645$var$cwd = $gHeVW$cwd();
const $149c1bd638913645$var$VARIANTS = [
    {
        name: "javascript",
        display: "JavaScript",
        color: (0, $gHeVW$yellow)
    },
    {
        name: "typescript",
        display: "TypeScript",
        color: (0, $gHeVW$blue)
    }
];
const $149c1bd638913645$var$renameFiles = {
    _gitignore: ".gitignore"
};
const $149c1bd638913645$var$defaultTargetDir = "promethium-app";
async function $149c1bd638913645$var$init() {
    const argTargetDir = $149c1bd638913645$var$formatTargetDir($gHeVW$argv[2]);
    let targetDir = argTargetDir || $149c1bd638913645$var$defaultTargetDir;
    const getProjectName = ()=>targetDir === "." ? (0, $gHeVW$nodepath).basename((0, $gHeVW$nodepath).resolve()) : targetDir;
    let result;
    try {
        result = await (0, $gHeVW$prompts)([
            {
                type: argTargetDir ? null : "text",
                name: "projectName",
                message: (0, $gHeVW$reset)("Project Name:"),
                onState: (state)=>{
                    targetDir = $149c1bd638913645$var$formatTargetDir(state.value) || $149c1bd638913645$var$defaultTargetDir;
                }
            },
            {
                type: ()=>!(0, $gHeVW$nodefs).existsSync(targetDir) || $149c1bd638913645$var$isEmpty(targetDir) ? null : "confirm",
                name: "overwrite",
                message: ()=>(targetDir === "." ? "Current directory" : `Target directory "${targetDir}"`) + ` is not empty. Remove existing files and continue?`
            },
            {
                type: (_, { overwrite: overwrite  })=>{
                    if (overwrite === false) throw new Error((0, $gHeVW$red)("✖") + " Operation cancelled");
                    return null;
                },
                name: "overwriteChecker"
            },
            {
                type: ()=>$149c1bd638913645$var$isValidPackageName(getProjectName()) ? null : "text",
                name: "packageName",
                message: (0, $gHeVW$reset)("Package name:"),
                initial: ()=>$149c1bd638913645$var$toValidPackageName(getProjectName()),
                validate: (dir)=>$149c1bd638913645$var$isValidPackageName(dir) || "Invalid package.json name"
            },
            {
                type: "select",
                name: "variant",
                message: (0, $gHeVW$reset)("Select a variant:"),
                choices: ()=>$149c1bd638913645$var$VARIANTS.map((variant)=>{
                        const variantColor = variant.color;
                        return {
                            title: variantColor(variant.display || variant.name),
                            value: variant.name
                        };
                    })
            }
        ], {
            onCancel: ()=>{
                throw new Error((0, $gHeVW$red)("✖") + " Operation cancelled");
            }
        });
    } catch (cancelled) {
        console.log(cancelled.message);
        return;
    }
    const { projectName: projectName , overwrite: overwrite , packageName: packageName , variant: variant  } = result;
    const root = (0, $gHeVW$nodepath).join($149c1bd638913645$var$cwd, targetDir);
    if (overwrite) $149c1bd638913645$var$emptyDir(root);
    else if (!(0, $gHeVW$nodefs).existsSync(root)) (0, $gHeVW$nodefs).mkdirSync(root, {
        recursive: true
    });
    const template = variant;
    const pkgInfo = $149c1bd638913645$var$pkgFromUserAgent(undefined);
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";
    const isYarn1 = pkgManager === "yarn" && pkgInfo?.version.startsWith("1.");
    console.log(`\nScaffolding project in ${root}...`);
    const templateDir = (0, $gHeVW$nodepath).resolve((0, $gHeVW$fileURLToPath)("file:///src/index.ts"), "..", `template-${template}`);
    const write = (file, content)=>{
        const targetPath = (0, $gHeVW$nodepath).join(root, $149c1bd638913645$var$renameFiles[file] ?? file);
        if (content) (0, $gHeVW$nodefs).writeFileSync(targetPath, content);
        else $149c1bd638913645$var$copy((0, $gHeVW$nodepath).join(templateDir, file), targetPath);
    };
    const files = (0, $gHeVW$nodefs).readdirSync(templateDir);
    for (const file of files.filter((f)=>f !== "package.json"))write(file);
    const pkg = JSON.parse((0, $gHeVW$nodefs).readFileSync((0, $gHeVW$nodepath).join(templateDir, `package.json`), "utf-8"));
    pkg.name = packageName || getProjectName();
    write("package.json", JSON.stringify(pkg, null, 2));
    console.log(`\nDone. Now run:\n`);
    if (root !== $149c1bd638913645$var$cwd) console.log(`  cd ${(0, $gHeVW$nodepath).relative($149c1bd638913645$var$cwd, root)}`);
    switch(pkgManager){
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
}
function $149c1bd638913645$var$formatTargetDir(targetDir) {
    return targetDir?.trim().replace(/\/+$/g, "");
}
function $149c1bd638913645$var$isValidPackageName(projectName) {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(projectName);
}
function $149c1bd638913645$var$toValidPackageName(projectName) {
    return projectName.trim().toLowerCase().replace(/\s+/g, "-").replace(/^[._]/, "").replace(/[^a-z\d\-~]+/g, "-");
}
function $149c1bd638913645$var$isEmpty(path) {
    const files = (0, $gHeVW$nodefs).readdirSync(path);
    return files.length === 0 || files.length === 1 && files[0] === ".git";
}
function $149c1bd638913645$var$emptyDir(dir) {
    if (!(0, $gHeVW$nodefs).existsSync(dir)) return;
    for (const file of (0, $gHeVW$nodefs).readdirSync(dir)){
        if (file === ".git") continue;
        (0, $gHeVW$nodefs).rmSync((0, $gHeVW$nodepath).resolve(dir, file), {
            recursive: true,
            force: true
        });
    }
}
function $149c1bd638913645$var$pkgFromUserAgent(userAgent) {
    if (!userAgent) return undefined;
    const pkgSpec = userAgent.split(" ")[0];
    const pkgSpecArr = pkgSpec.split("/");
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1]
    };
}
function $149c1bd638913645$var$copy(src, dest) {
    const stat = (0, $gHeVW$nodefs).statSync(src);
    if (stat.isDirectory()) $149c1bd638913645$var$copyDir(src, dest);
    else (0, $gHeVW$nodefs).copyFileSync(src, dest);
}
function $149c1bd638913645$var$copyDir(srcDir, destDir) {
    (0, $gHeVW$nodefs).mkdirSync(destDir, {
        recursive: true
    });
    for (const file of (0, $gHeVW$nodefs).readdirSync(srcDir)){
        const srcFile = (0, $gHeVW$nodepath).resolve(srcDir, file);
        const destFile = (0, $gHeVW$nodepath).resolve(destDir, file);
        $149c1bd638913645$var$copy(srcFile, destFile);
    }
}
$149c1bd638913645$var$init().catch((e)=>{
    console.error(e);
});


//# sourceMappingURL=index.js.map
