/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
        pkgRoot: "libs/react-kit",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "libs/react-kit/package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    "@semantic-release/gitlab",
  ],
};
