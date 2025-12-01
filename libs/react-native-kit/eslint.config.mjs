import nx from "@nx/eslint-plugin";
import baseConfig from "../../eslint.config.mjs";

export default [
    ...baseConfig,
    {
        "files": [
            "**/*.json"
        ],
        "rules": {
            "@nx/dependency-checks": [
                "error",
                {
                    "ignoredFiles": [
                        "{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}"
                    ],
                    "ignoredDependencies": [
                        "@nx/jest",
                        "@nx/rollup",
                        "@rollup/plugin-url",
                        "@svgr/rollup"
                    ]
                }
            ]
        },
        "languageOptions": {
            "parser": (await import('jsonc-eslint-parser'))
        }
    },
    ...nx.configs["flat/react"],
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        // Override or add rules here
        rules: {}
    },
    {
        ignores: [
            ".expo",
            "web-build",
            "cache",
            "dist"
        ]
    }
];
