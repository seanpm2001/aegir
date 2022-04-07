import { semanticReleaseConfig } from '../semantic-release-config.js'
import mergeOptions from 'merge-options'
import {
  sortFields,
  constructManifest
} from '../utils.js'

const merge = mergeOptions.bind({ ignoreUndefined: true })

/**
 * @param {any} manifest
 * @param {string} branchName
 * @param {string} repoUrl
 * @param {string} [homePage]
 */
export async function typedCJSManifest (manifest, branchName, repoUrl, homePage = repoUrl) {
  let proposedManifest = constructManifest(manifest, {
    main: 'src/index.js',
    types: 'dist/src/index.d.ts',
    typesVersions: {
      '*': {
        '*': [
          '*',
          'dist/*',
          'dist/src/*'
        ],
        'src/*': [
          '*',
          'dist/*',
          'dist/src/*'
        ]
      }
    },
    files: [
      'src',
      'dist'
    ],
    eslintConfig: merge({
      extends: 'ipfs'
    }, manifest.eslintConfig),
    release: manifest.scripts?.release?.includes('semantic-release') ? semanticReleaseConfig(branchName) : undefined
  }, repoUrl, homePage)

  const rest = {
    ...sortFields(manifest)
  }

  for (const key of Object.keys(proposedManifest)) {
    delete rest[key]
  }

  proposedManifest = {
    ...proposedManifest,
    ...rest,
    contributors: undefined,
    leadMaintainer: undefined
  }

  return proposedManifest
}
