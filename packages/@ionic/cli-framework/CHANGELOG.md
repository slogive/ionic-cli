# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.0.0 (2024-10-16)


### Bug Fixes

* **cli:** resolve vm2 security vulnerability ([#5070](https://github.com/ionic-team/ionic-cli/issues/5070)) ([4050419](https://github.com/ionic-team/ionic-cli/commit/4050419bef70fb92e58b0a83cd4b68b48090e596))
* fix parsing of command line options ([060f67c](https://github.com/ionic-team/ionic-cli/commit/060f67cf63d37662ae44c4ae952161464a5d553c))
* pin tslib to avoid "Cannot set property pathExists" error ([689e1f0](https://github.com/ionic-team/ionic-cli/commit/689e1f038b907356ef855a067a76d4822e7072a8))
* use native ES2022 error cause ([#5010](https://github.com/ionic-team/ionic-cli/issues/5010)) ([a97ba2b](https://github.com/ionic-team/ionic-cli/commit/a97ba2bcac4556017ba010692f71fed2bef3f77b))
* use native ES2022 error cause ([#5010](https://github.com/ionic-team/ionic-cli/issues/5010)) ([0c4cd0f](https://github.com/ionic-team/ionic-cli/commit/0c4cd0f47e00b43e8c0ce4eef072351a846b566c))
* **ci:** include tslint.js in git ([f1d768c](https://github.com/ionic-team/ionic-cli/commit/f1d768c449357616e63158f7f3d8d17199710598))
* **columnar:** handle newlines in cells gracefully ([e0415d6](https://github.com/ionic-team/ionic-cli/commit/e0415d6cec35194874b2a844528b786e71ae31f6))
* **config:** rewrite config for not found & syntax errors ([13298f1](https://github.com/ionic-team/ionic-cli/commit/13298f14f5b43571bfa20f90046e3edfb85b0d51))
* **config:** write json file with ending newline ([dc3f2a5](https://github.com/ionic-team/ionic-cli/commit/dc3f2a56543945c60ee8120e4237a6c16eaaa40f))
* **cordova:** respect --nosave, include --verbose ([83f52e7](https://github.com/ionic-team/ionic-cli/commit/83f52e7784cc6aa105339e7ba08c29d111b0f314))
* **deps:** add missing dep ([dfe28e1](https://github.com/ionic-team/ionic-cli/commit/dfe28e170f78dd1045bd9d73a0151adb70176072))
* **deps:** make types dependencies ([87d6959](https://github.com/ionic-team/ionic-cli/commit/87d69591b89d6d1d77d25f4c3db2efd8803f55a8))
* **generate:** make poorly implemented function slightly better ([b803818](https://github.com/ionic-team/ionic-cli/commit/b803818971022e91a0020e57b9732eee1600f9a9))
* **help:** add back help decorations ([554fe0a](https://github.com/ionic-team/ionic-cli/commit/554fe0adde5f79e31ac46bce1486fb273e386c8a))
* **help:** custom colors are not passed to SchemaHelpFormatter ([#4115](https://github.com/ionic-team/ionic-cli/issues/4115)) ([5634e9f](https://github.com/ionic-team/ionic-cli/commit/5634e9f8e8ce6edea836456d03281f177ea45218))
* **help:** filter out unnecessary global options ([7809c99](https://github.com/ionic-team/ionic-cli/commit/7809c99ae74b57d63a2999a9809aab2f582711c1))
* **help:** hide commands if namespace is hidden ([c19d27e](https://github.com/ionic-team/ionic-cli/commit/c19d27ef80c779c8125761934681574781617fc0))
* **help:** make namespace/command groups unique when displaying ([32215b2](https://github.com/ionic-team/ionic-cli/commit/32215b27d4511bd8966bb07ba1663392f790336f))
* **help:** show inputs in schema formatter ([f4d85ab](https://github.com/ionic-team/ionic-cli/commit/f4d85ab76fbc728708688ced55cd276d5ccfedba))
* **help:** use proper full command/namespace name, not alias ([e42efc6](https://github.com/ionic-team/ionic-cli/commit/e42efc6ad6ce48545fe3f106720a9aa14af478f5))
* **logger:** cleanup formatting ([f58cea9](https://github.com/ionic-team/ionic-cli/commit/f58cea9dc4093a509c0dac8b693c5f4f2c1cc1b6))
* **logger:** colorize titles ([f87826b](https://github.com/ionic-team/ionic-cli/commit/f87826b985b6313359d56822113a9e62d786bbba))
* **logger:** fix indentation for tagged formatter ([6f04266](https://github.com/ionic-team/ionic-cli/commit/6f04266fa5253163dda696ca8ecdddad1f8f6ab5))
* **logger:** properly clone handlers ([661c8ec](https://github.com/ionic-team/ionic-cli/commit/661c8ec5af809c589a97a8c23c68402143983a4d))
* **logger:** pull up lines for titleized logger messages ([27ad0aa](https://github.com/ionic-team/ionic-cli/commit/27ad0aabf6a94d3b54c6a976832849550c568704))
* **options:** account for empty -- in unparseArgs() ([d21b84f](https://github.com/ionic-team/ionic-cli/commit/d21b84f03057ce568532ac678f9cb8e6a5800ba9))
* **options:** unparse single-letter options with single dash ([c3e0bf3](https://github.com/ionic-team/ionic-cli/commit/c3e0bf336c6574bd7cd9317b1539c8212b25bc61))
* **process:** catch and log errors in exit queue ([f3cd886](https://github.com/ionic-team/ionic-cli/commit/f3cd88669a8da3e61196eec03de218ccb697cf80))
* **process:** keep node running for `sleepForever()` ([ea08f8d](https://github.com/ionic-team/ionic-cli/commit/ea08f8d92d227b38575a6172b14c78f14e8ce0eb))
* **process:** processExit should default to exit code 0 ([b65f392](https://github.com/ionic-team/ionic-cli/commit/b65f392a77e91d4f008051047d78c0bcb834517d))
* **serve:** check all network interfaces for an available port ([30fd6ef](https://github.com/ionic-team/ionic-cli/commit/30fd6ef5b5e24d8ded742bd5a9b93ea18e864e0e))
* **serve:** fix unclosed connection issue again ([#3500](https://github.com/ionic-team/ionic-cli/issues/3500)) ([1f0ef3b](https://github.com/ionic-team/ionic-cli/commit/1f0ef3b0b2bfb1e5ae5e04248bae29cf0adb50de))
* **serve:** keep env open to allow output ([c3121a2](https://github.com/ionic-team/ionic-cli/commit/c3121a2124a946cafdce23b1fc17656664b82f60))
* **serve:** properly cleanup child processes ([#3481](https://github.com/ionic-team/ionic-cli/issues/3481)) ([38217bf](https://github.com/ionic-team/ionic-cli/commit/38217bf66b449b7ec14378965b2028f3281cf6ab))
* **serve:** use 127.0.0.1 to attempt connections ([#3476](https://github.com/ionic-team/ionic-cli/issues/3476)) ([12c3f35](https://github.com/ionic-team/ionic-cli/commit/12c3f353dda789016c584310b5129258dc06fb17))
* **shell:** kill processes on exit by default ([db1b2aa](https://github.com/ionic-team/ionic-cli/commit/db1b2aa2e08cf0ae7506ce734a3459eaa7235840))
* **shell:** rely on piped stream management ([4788983](https://github.com/ionic-team/ionic-cli/commit/478898365e7520e91bc6ba8b0d894585a19941ea))
* **start:** clear up confusion around project ID ([bb565b4](https://github.com/ionic-team/ionic-cli/commit/bb565b4010d9b547d491fdc9b4517a49af51f408))
* **start:** fix stdio freezing issue on Windows ([#3725](https://github.com/ionic-team/ionic-cli/issues/3725)) ([a570770](https://github.com/ionic-team/ionic-cli/commit/a570770809e903312192f058a3b8d3f9ff56e7f4))
* **start:** friendlier app name/slug ([f811dae](https://github.com/ionic-team/ionic-cli/commit/f811dae5f6bb915d8f278176d6aaacf2c568a53c))
* **string:** add regex for valid slug ([482c2ae](https://github.com/ionic-team/ionic-cli/commit/482c2ae944a635290015d23aeb4d96916bbc2b11))
* **terminal:** expand upon and fix Windows shell detection ([c3aa5a1](https://github.com/ionic-team/ionic-cli/commit/c3aa5a19763f853a7f7067443ea6a5e4e8d463b4)), closes [/github.com/ionic-team/ionic-cli/commit/dcc912d889011afd5944eaf4829bc8e5b4d0f4b6#commitcomment-31280556](https://github.com//github.com/ionic-team/ionic-cli/commit/dcc912d889011afd5944eaf4829bc8e5b4d0f4b6/issues/commitcomment-31280556)
* actually exit with exitCode exception ([0fc4eac](https://github.com/ionic-team/ionic-cli/commit/0fc4eac6c78b464440018f11ee1b23f9ef61448c))
* align types with new node typings for ProcessEnv ([21cb7c5](https://github.com/ionic-team/ionic-cli/commit/21cb7c5f53031f269f4ebe8c1fffc93314de0be7))
* disable interactivity for non-tty terminals ([aa5ee25](https://github.com/ionic-team/ionic-cli/commit/aa5ee25b3ef213ba7def1fa65956a1a2222208d2))
* use built-in type for process.env ([03855c4](https://github.com/ionic-team/ionic-cli/commit/03855c4b0a692621e100b907f5a3b7dd4351a933))
* **ssh:** allow tilde expansion upon path inputs ([0e001d4](https://github.com/ionic-team/ionic-cli/commit/0e001d4cf8c854e92dcebb365fe0ed392c0f1ec0))
* **terminal:** test all stdio for tty ([cfa7a47](https://github.com/ionic-team/ionic-cli/commit/cfa7a47f3aac00c21e71c6fcdfa40785464fdd05))
* **test:** fix columnar test ([f69a036](https://github.com/ionic-team/ionic-cli/commit/f69a036f04eba91070e6899ea7cfe0f6a97888bc))


### chore

* require Node 10 ([5a47874](https://github.com/ionic-team/ionic-cli/commit/5a478746c074207b6dc96aa8771f04a606deb1ef))
* **output:** remove unused BottomBar stuff ([e2023d1](https://github.com/ionic-team/ionic-cli/commit/e2023d1f79697915d5f0476c691c82d5951e97aa))
* require Node 8 ([5670e68](https://github.com/ionic-team/ionic-cli/commit/5670e68eafb4b6ba2e60b6120e836931508c03a5))


### Code Refactoring

* do not re-export from @ionic/cli-framework-output ([a91b5a4](https://github.com/ionic-team/ionic-cli/commit/a91b5a4cb76570154e560bdea3138a425833ce8c))
* **prompts:** remove prompt support ([82241ef](https://github.com/ionic-team/ionic-cli/commit/82241ef7ddf8fdc6fc0db051a9acd0ed100c3fa8))


### Features

* **angular:** Support multiple projects and configurations in a single workspace ([#3159](https://github.com/ionic-team/ionic-cli/issues/3159)) ([c2f31da](https://github.com/ionic-team/ionic-cli/commit/c2f31da81f6503cfa805f67de36eae194c99ae5f)), closes [#3087](https://github.com/ionic-team/ionic-cli/issues/3087)
* **array:** asynchronous map ([f0a3b88](https://github.com/ionic-team/ionic-cli/commit/f0a3b88216b3b0677b7e6b6aea4634c81415f3f5))
* **array:** function for filtering concurrently ([49eccb3](https://github.com/ionic-team/ionic-cli/commit/49eccb3043ab2ea4e33ae8477d00bbf946883b03))
* **build:** add --source-map flag to v3 + v4 ([1fddee1](https://github.com/ionic-team/ionic-cli/commit/1fddee11c00d17f6dab998efa9be3f3da7c81521))
* **cli-framework:** optionally supply runinfo ([4c3ef84](https://github.com/ionic-team/ionic-cli/commit/4c3ef84df019aa6884f81d9c5f16b08d2727945d))
* **colors:** success/failure colors ([174cba0](https://github.com/ionic-team/ionic-cli/commit/174cba004b2fb45c0ae1b01d32a3462a8d3f8088))
* **config:** add base config class ([7986f99](https://github.com/ionic-team/ionic-cli/commit/7986f99ef3dd6644ca2a26432101d15f636108a0))
* **config:** add spaces option when writing JSON config ([#4612](https://github.com/ionic-team/ionic-cli/issues/4612)) ([fdd9bb2](https://github.com/ionic-team/ionic-cli/commit/fdd9bb26098441238adc56ea7a67b385a3b9a964))
* **config:** optionally specify default value during get ([8a55999](https://github.com/ionic-team/ionic-cli/commit/8a559993f0a43115c6cfb35dc0fe11d25b753bea))
* **config:** path prefix to mutate nested object within file ([bced553](https://github.com/ionic-team/ionic-cli/commit/bced55357a27d9b3be3951f878ee4304c17b83f8))
* **executor:** integrate help into executor ([a4d4f9f](https://github.com/ionic-team/ionic-cli/commit/a4d4f9f935b010b9b570ef6075ed7de1e3c47af5))
* **executor:** ipc mode (wip) ([62c0c3a](https://github.com/ionic-team/ionic-cli/commit/62c0c3a97da2dc6e2e8219a130592c63743f5632))
* **executor:** print input validation errors, handle exitCode ([a400d51](https://github.com/ionic-team/ionic-cli/commit/a400d51e951dcb08e2f4adbc61b5ed733c92aac5))
* **executor:** show help for `-?` flag as well ([67182ba](https://github.com/ionic-team/ionic-cli/commit/67182ba33dcdc7a7c2e78414a83bfebd816864bf))
* **fn:** add function for resolving values from function series ([ac97f78](https://github.com/ionic-team/ionic-cli/commit/ac97f782482860b614fd9844800ec0751634135e))
* **format:** add support to hide separators in columnar ([ed7ee92](https://github.com/ionic-team/ionic-cli/commit/ed7ee920e657782e16f1d048426884d2f7860fc6))
* **framework:** tmpfilepath function ([0f0999a](https://github.com/ionic-team/ionic-cli/commit/0f0999ab8f26117ed792cfd2f479b7f148c6b571))
* **fs:** recursive readdir ([bcc580c](https://github.com/ionic-team/ionic-cli/commit/bcc580cd3b794c0b307a50dc930e6868f3dece8d))
* **help:** add flair for paid content ([e7978e2](https://github.com/ionic-team/ionic-cli/commit/e7978e24edfeffbe0dd4601e1b8d20415cb005bc))
* **help:** export option name formatter ([0fed074](https://github.com/ionic-team/ionic-cli/commit/0fed074828c3523a5106b52120ccf3337a3f0bd3))
* **help:** formatBeforeInputSummary and formatAfterInputSummary ([70ac3ab](https://github.com/ionic-team/ionic-cli/commit/70ac3ab633dc7dd65a2ac344c81a01f7914597b8))
* **help:** json help output ([1f5cd78](https://github.com/ionic-team/ionic-cli/commit/1f5cd787364dc3b321d638f83f882ab1ebde0682))
* **help:** serialize groups in schema output ([c8e32be](https://github.com/ionic-team/ionic-cli/commit/c8e32be4cffd9dd797125cff83095857d51c6ac3))
* **help:** show aliases for namespaces ([8b9cb8f](https://github.com/ionic-team/ionic-cli/commit/8b9cb8f25eb7dca405532e1a406f4750ff360a0b))
* **help:** spec for customizing option help schema ([73830bc](https://github.com/ionic-team/ionic-cli/commit/73830bcb6ca934a5d726062775a04add8e2d6804))
* **help:** text/link footnotes for descriptions ([2c74d53](https://github.com/ionic-team/ionic-cli/commit/2c74d53861fbe3ca1adab3fc4ef3a66ab9819900))
* **help:** utility function to change schema to metadata ([1a40019](https://github.com/ionic-team/ionic-cli/commit/1a40019b44e79c97db601757d3c3576ebe9d144b))
* **help:** weaken the color of deprecated commands and options ([66f48d8](https://github.com/ionic-team/ionic-cli/commit/66f48d81add63e51dbc258d7ad0663a512f53657))
* **hooks:** start of JS hook system ([943ba67](https://github.com/ionic-team/ionic-cli/commit/943ba6731fcc2f2d41af2fae868836a75d287a50))
* **integrations:** cordova and gulp integration ([3137c76](https://github.com/ionic-team/ionic-cli/commit/3137c76630cfedbeb86be29583a996cb865b2cf9))
* **logger:** add clone method ([3478fb9](https://github.com/ionic-team/ionic-cli/commit/3478fb9ff314ca34a8cd3815ec3a082f347de7b9))
* **logger:** add leveled logger ([fc75bb9](https://github.com/ionic-team/ionic-cli/commit/fc75bb94b807613bc9c5605aa7bcd170b77f88a5))
* **logger:** add nl utility method ([2542742](https://github.com/ionic-team/ionic-cli/commit/254274273de9a4289e1e6428dd5646fed81a0979))
* **logger:** add prefix option for formatter ([5d68b19](https://github.com/ionic-team/ionic-cli/commit/5d68b19a893056a0c5546b01b6fb6cb86a35462f))
* **node:** add resolveBin utility ([6a21627](https://github.com/ionic-team/ionic-cli/commit/6a2162751d06c35cb3466efbdeac59cf8e2cff14))
* **shell:** accept pathed name ([7e6c713](https://github.com/ionic-team/ionic-cli/commit/7e6c71354aeecd4fb4ac943ee4c7868ae610ee4c))
* **shell:** provide which utility for finding binaries ([4dbe922](https://github.com/ionic-team/ionic-cli/commit/4dbe922233aa322b49fd820b1bb574a471b94500))
* **validators:** `combine` for combining validators into one ([bcef698](https://github.com/ionic-team/ionic-cli/commit/bcef698d413e21403a9560b49b70abc6fb5e7cb8))
* Command-Line Completions ([9f66512](https://github.com/ionic-team/ionic-cli/commit/9f66512b68766771cb0c9340cbe7612ac0c73037))
* **help:** color refactor ([5938429](https://github.com/ionic-team/ionic-cli/commit/593842957eb195fce975a56be95e90a9d65def56))
* **logger:** add prefixed logger formatter ([159f964](https://github.com/ionic-team/ionic-cli/commit/159f9643f68484699d5a3edb4183bc8c759a2d68))
* **logger:** add title option to tagged formatter ([68a2185](https://github.com/ionic-team/ionic-cli/commit/68a2185039903f71d4b51f757213b065b4454df7))
* **logger:** formatter ([ef9a929](https://github.com/ionic-team/ionic-cli/commit/ef9a929f1f912d6d4a6f53834b13fdae06b7ac00))
* **logger:** request no formatting ([87cb156](https://github.com/ionic-team/ionic-cli/commit/87cb1566e1f10088504ceafa1d3f0764f2a0fc3c))
* **namespace:** add `useAliases` option to `locate()` ([489617b](https://github.com/ionic-team/ionic-cli/commit/489617b3d64f7c4a88d9d0fcc514ff6cd348159d))
* **namespace:** add ability to alias namespaces ([4d3f237](https://github.com/ionic-team/ionic-cli/commit/4d3f2379f63d848b56a54bab039424b9aa8e6d99)), closes [/github.com/ionic-team/ionic-cli/pull/3037#issuecomment-376438885](https://github.com//github.com/ionic-team/ionic-cli/pull/3037/issues/issuecomment-376438885)
* **object:** add `keysWithoutAliases()` method to `AliasedMap` ([f4807f4](https://github.com/ionic-team/ionic-cli/commit/f4807f46631bed2939c48db812e67a554fd9a041))
* **options:** ability to filter out unknown options ([7258f1b](https://github.com/ionic-team/ionic-cli/commit/7258f1bb89c6f411739bb74d58df8212519f539f))
* **options:** optionally pass in additional options to exclude aliases ([b6c939f](https://github.com/ionic-team/ionic-cli/commit/b6c939ffab6ea2062276f935a599f91012d3f95a))
* **process:** improve upon process exit handler ([ec5305c](https://github.com/ionic-team/ionic-cli/commit/ec5305ce60da6bcd025b05d62ab66c9a13117a40))
* **process:** process.env object type ([d3b2388](https://github.com/ionic-team/ionic-cli/commit/d3b23889e93958d1fdaba0c1c77166c5d4332640))
* **process:** sleep, sleepUntil ([00625bf](https://github.com/ionic-team/ionic-cli/commit/00625bf0fef9754823ae64bfacc13aa150bef3c6))
* **prompts:** add interactive prompts ([e9212bc](https://github.com/ionic-team/ionic-cli/commit/e9212bc8dbf0a9524617fec63798bf8335b25bd2))
* **shell:** bashify for pretty printing commands ([45158d4](https://github.com/ionic-team/ionic-cli/commit/45158d46487df90ecbe801f5d659ea24209f2846))
* **shell:** error for subprocesses that exit via signal ([3af1cee](https://github.com/ionic-team/ionic-cli/commit/3af1cee462c9497c64e07f543cb0eb946fb2bd70))
* **shell:** shell command primitive ([0ceb8bc](https://github.com/ionic-team/ionic-cli/commit/0ceb8bc800bd22146a5bf2867177ba4a3c8a395c))
* **streams:** NullStream ([b623ebd](https://github.com/ionic-team/ionic-cli/commit/b623ebd3aeb978c1133e44d4ee4f2d8a47838b60))
* **string:** add newline enforcer ([1f622c5](https://github.com/ionic-team/ionic-cli/commit/1f622c54e2dc90b4bb30a241e1d7971ed7f73ba4))
* **string:** add slugify function ([cd0a494](https://github.com/ionic-team/ionic-cli/commit/cd0a49456ee8cecf4abda515afd5b1557527cabc))
* **tasks:** add foundational task classes ([25c5e30](https://github.com/ionic-team/ionic-cli/commit/25c5e30ea704a635cbd5037632c451431b384bdf))
* **tasks:** export into lib ([31f9d48](https://github.com/ionic-team/ionic-cli/commit/31f9d480dfcb92de995207508665192d0c330c90))
* **terminal:** detect windows shell ([dcc912d](https://github.com/ionic-team/ionic-cli/commit/dcc912d889011afd5944eaf4829bc8e5b4d0f4b6))
* monorepo support ([9f1e202](https://github.com/ionic-team/ionic-cli/commit/9f1e202b3cbfe9536ceaba7873dde2c6f9d365ba))


### Reverts

* use native ES2022 error cause ([#5060](https://github.com/ionic-team/ionic-cli/issues/5060)) ([1e64a1a](https://github.com/ionic-team/ionic-cli/commit/1e64a1ada60545adf8e7c99fbd1f8766cf2416f9))


### BREAKING CHANGES

* `message`, `stack`, and `error` properties removed from `BaseError` and `SubprocessError`
* Install `@ionic/cli-framework-output` and import from it directly.
* A minimum of Node.js 10.3.0 is required.
* **prompts:** This package no longer supports interactive prompts. See `@ionic/cli-framework-prompts`.
* **output:** Remove `BottomBarOutputStrategy`
* A minimum of Node.js 8.9.4 is required.
* **help:** option/command/namespace groups are now `MetadataGroup`





## [6.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@6.0.0...@ionic/cli-framework@6.0.1) (2023-12-19)


### Bug Fixes

* **cli:** resolve vm2 security vulnerability ([#5070](https://github.com/ionic-team/ionic-cli/issues/5070)) ([4050419](https://github.com/ionic-team/ionic-cli/commit/4050419bef70fb92e58b0a83cd4b68b48090e596))





# [6.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.7...@ionic/cli-framework@6.0.0) (2023-11-08)


### Bug Fixes

* use native ES2022 error cause ([#5010](https://github.com/ionic-team/ionic-cli/issues/5010)) ([a97ba2b](https://github.com/ionic-team/ionic-cli/commit/a97ba2bcac4556017ba010692f71fed2bef3f77b))


### BREAKING CHANGES

* `message`, `stack`, and `error` properties removed from `BaseError` and `SubprocessError`





## [5.1.7](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.6...@ionic/cli-framework@5.1.7) (2023-11-08)


### Reverts

* use native ES2022 error cause ([#5060](https://github.com/ionic-team/ionic-cli/issues/5060)) ([1e64a1a](https://github.com/ionic-team/ionic-cli/commit/1e64a1ada60545adf8e7c99fbd1f8766cf2416f9))





## [5.1.6](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.5...@ionic/cli-framework@5.1.6) (2023-11-07)

**Note:** Version bump only for package @ionic/cli-framework





## [5.1.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.4...@ionic/cli-framework@5.1.5) (2023-11-07)


### Bug Fixes

* use native ES2022 error cause ([#5010](https://github.com/ionic-team/ionic-cli/issues/5010)) ([0c4cd0f](https://github.com/ionic-team/ionic-cli/commit/0c4cd0f47e00b43e8c0ce4eef072351a846b566c))





## [5.1.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.3...@ionic/cli-framework@5.1.4) (2023-03-29)

**Note:** Version bump only for package @ionic/cli-framework





## [5.1.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.2...@ionic/cli-framework@5.1.3) (2022-06-16)

**Note:** Version bump only for package @ionic/cli-framework





## [5.1.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.1...@ionic/cli-framework@5.1.2) (2022-05-09)

**Note:** Version bump only for package @ionic/cli-framework





## [5.1.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.1.0...@ionic/cli-framework@5.1.1) (2022-03-04)

**Note:** Version bump only for package @ionic/cli-framework





# [5.1.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.6...@ionic/cli-framework@5.1.0) (2020-12-10)


### Features

* **config:** add spaces option when writing JSON config ([#4612](https://github.com/ionic-team/ionic-cli/issues/4612)) ([fdd9bb2](https://github.com/ionic-team/ionic-cli/commit/fdd9bb26098441238adc56ea7a67b385a3b9a964))





## [5.0.6](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.5...@ionic/cli-framework@5.0.6) (2020-09-29)

**Note:** Version bump only for package @ionic/cli-framework





## [5.0.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.4...@ionic/cli-framework@5.0.5) (2020-09-24)

**Note:** Version bump only for package @ionic/cli-framework





## [5.0.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.3...@ionic/cli-framework@5.0.4) (2020-09-02)

**Note:** Version bump only for package @ionic/cli-framework





## [5.0.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.2...@ionic/cli-framework@5.0.3) (2020-08-29)

**Note:** Version bump only for package @ionic/cli-framework





## [5.0.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.1...@ionic/cli-framework@5.0.2) (2020-08-28)

**Note:** Version bump only for package @ionic/cli-framework





## [5.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@5.0.0...@ionic/cli-framework@5.0.1) (2020-08-27)

**Note:** Version bump only for package @ionic/cli-framework





# [5.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.2.2...@ionic/cli-framework@5.0.0) (2020-08-27)


### Code Refactoring

* do not re-export from @ionic/cli-framework-output ([a91b5a4](https://github.com/ionic-team/ionic-cli/commit/a91b5a4cb76570154e560bdea3138a425833ce8c))


### BREAKING CHANGES

* Install `@ionic/cli-framework-output` and import from it directly.





## [4.2.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.2.1...@ionic/cli-framework@4.2.2) (2020-08-26)

**Note:** Version bump only for package @ionic/cli-framework





## [4.2.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.2.0...@ionic/cli-framework@4.2.1) (2020-08-25)

**Note:** Version bump only for package @ionic/cli-framework





# [4.2.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.5...@ionic/cli-framework@4.2.0) (2020-06-02)


### Features

* **help:** formatBeforeInputSummary and formatAfterInputSummary ([70ac3ab](https://github.com/ionic-team/ionic-cli/commit/70ac3ab633dc7dd65a2ac344c81a01f7914597b8))





## [4.1.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.4...@ionic/cli-framework@4.1.5) (2020-05-12)


### Bug Fixes

* pin tslib to avoid "Cannot set property pathExists" error ([689e1f0](https://github.com/ionic-team/ionic-cli/commit/689e1f038b907356ef855a067a76d4822e7072a8))





## [4.1.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.3...@ionic/cli-framework@4.1.4) (2020-05-06)

**Note:** Version bump only for package @ionic/cli-framework





## [4.1.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.2...@ionic/cli-framework@4.1.3) (2020-04-29)

**Note:** Version bump only for package @ionic/cli-framework





## [4.1.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.1...@ionic/cli-framework@4.1.2) (2020-03-30)

**Note:** Version bump only for package @ionic/cli-framework





## [4.1.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.1.0...@ionic/cli-framework@4.1.1) (2020-03-03)

**Note:** Version bump only for package @ionic/cli-framework





# 4.1.0 (2020-02-11)


### Features

* **start:** add new list starter option ([#4315](https://github.com/ionic-team/ionic-cli/issues/4315)) ([1df44c1](https://github.com/ionic-team/ionic-cli/commit/1df44c1591f37b89f2b672857740edd6cb2aea67))





## [4.0.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.0.1...@ionic/cli-framework@4.0.2) (2020-02-10)

**Note:** Version bump only for package @ionic/cli-framework





## [4.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@4.0.0...@ionic/cli-framework@4.0.1) (2020-02-03)


### Bug Fixes

* **help:** use proper full command/namespace name, not alias ([e42efc6](https://github.com/ionic-team/ionic-cli/commit/e42efc6ad6ce48545fe3f106720a9aa14af478f5))





# [4.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.6...@ionic/cli-framework@4.0.0) (2020-01-25)


### chore

* require Node 10 ([5a47874](https://github.com/ionic-team/ionic-cli/commit/5a478746c074207b6dc96aa8771f04a606deb1ef))


### BREAKING CHANGES

* A minimum of Node.js 10.3.0 is required.





## [3.0.6](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.5...@ionic/cli-framework@3.0.6) (2020-01-13)

**Note:** Version bump only for package @ionic/cli-framework





## [3.0.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.4...@ionic/cli-framework@3.0.5) (2019-12-10)


### Bug Fixes

* **help:** make namespace/command groups unique when displaying ([32215b2](https://github.com/ionic-team/ionic-cli/commit/32215b27d4511bd8966bb07ba1663392f790336f))





## [3.0.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.3...@ionic/cli-framework@3.0.4) (2019-12-05)

**Note:** Version bump only for package @ionic/cli-framework





## [3.0.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.2...@ionic/cli-framework@3.0.3) (2019-11-25)

**Note:** Version bump only for package @ionic/cli-framework





## [3.0.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.1...@ionic/cli-framework@3.0.2) (2019-11-24)


### Bug Fixes

* fix parsing of command line options ([060f67c](https://github.com/ionic-team/ionic-cli/commit/060f67cf63d37662ae44c4ae952161464a5d553c))





## [3.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@3.0.0...@ionic/cli-framework@3.0.1) (2019-11-21)

**Note:** Version bump only for package @ionic/cli-framework





# [3.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.8...@ionic/cli-framework@3.0.0) (2019-10-14)


### Code Refactoring

* **prompts:** remove prompt support ([82241ef](https://github.com/ionic-team/ionic-cli/commit/82241ef7ddf8fdc6fc0db051a9acd0ed100c3fa8))


### BREAKING CHANGES

* **prompts:** This package no longer supports interactive prompts. See `@ionic/cli-framework-prompts`.





## [2.1.8](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.7...@ionic/cli-framework@2.1.8) (2019-10-14)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.7](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.6...@ionic/cli-framework@2.1.7) (2019-09-18)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.6](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.5...@ionic/cli-framework@2.1.6) (2019-08-28)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.4...@ionic/cli-framework@2.1.5) (2019-08-23)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.3...@ionic/cli-framework@2.1.4) (2019-08-14)


### Bug Fixes

* **help:** custom colors are not passed to SchemaHelpFormatter ([#4115](https://github.com/ionic-team/ionic-cli/issues/4115)) ([5634e9f](https://github.com/ionic-team/ionic-cli/commit/5634e9f))





## [2.1.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.2...@ionic/cli-framework@2.1.3) (2019-08-07)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.1...@ionic/cli-framework@2.1.2) (2019-07-09)

**Note:** Version bump only for package @ionic/cli-framework





## [2.1.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.1.0...@ionic/cli-framework@2.1.1) (2019-06-28)

**Note:** Version bump only for package @ionic/cli-framework





# [2.1.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.0.3...@ionic/cli-framework@2.1.0) (2019-06-21)


### Features

* **validators:** `combine` for combining validators into one ([bcef698](https://github.com/ionic-team/ionic-cli/commit/bcef698))





## [2.0.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.0.2...@ionic/cli-framework@2.0.3) (2019-06-18)

**Note:** Version bump only for package @ionic/cli-framework





## [2.0.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.0.1...@ionic/cli-framework@2.0.2) (2019-06-10)

**Note:** Version bump only for package @ionic/cli-framework





## [2.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@2.0.0...@ionic/cli-framework@2.0.1) (2019-06-05)

**Note:** Version bump only for package @ionic/cli-framework





# [2.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.7.0...@ionic/cli-framework@2.0.0) (2019-05-29)


### chore

* **output:** remove unused BottomBar stuff ([e2023d1](https://github.com/ionic-team/ionic-cli/commit/e2023d1))
* require Node 8 ([5670e68](https://github.com/ionic-team/ionic-cli/commit/5670e68))


### Features

* Command-Line Completions ([9f66512](https://github.com/ionic-team/ionic-cli/commit/9f66512))
* **help:** color refactor ([5938429](https://github.com/ionic-team/ionic-cli/commit/5938429))


### BREAKING CHANGES

* **output:** Remove `BottomBarOutputStrategy`
* A minimum of Node.js 8.9.4 is required.
* **help:** option/command/namespace groups are now `MetadataGroup`





<a name="1.7.0"></a>
# [1.7.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.6.3...@ionic/cli-framework@1.7.0) (2019-03-12)


### Features

* **help:** add flair for paid content ([e7978e2](https://github.com/ionic-team/ionic-cli/commit/e7978e2))




<a name="1.6.3"></a>
## [1.6.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.6.2...@ionic/cli-framework@1.6.3) (2019-03-06)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.6.2"></a>
## [1.6.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.6.1...@ionic/cli-framework@1.6.2) (2019-02-27)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.6.1"></a>
## [1.6.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.6.0...@ionic/cli-framework@1.6.1) (2019-02-15)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.6.0"></a>
# [1.6.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.5.3...@ionic/cli-framework@1.6.0) (2019-01-23)


### Features

* **help:** text/link footnotes for descriptions ([2c74d53](https://github.com/ionic-team/ionic-cli/commit/2c74d53))




<a name="1.5.3"></a>
## [1.5.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.5.2...@ionic/cli-framework@1.5.3) (2019-01-08)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.5.2"></a>
## [1.5.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.5.1...@ionic/cli-framework@1.5.2) (2019-01-07)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.5.1"></a>
## [1.5.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.5.0...@ionic/cli-framework@1.5.1) (2018-12-19)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.5.0"></a>
# [1.5.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.4.0...@ionic/cli-framework@1.5.0) (2018-11-27)


### Features

* **help:** weaken the color of deprecated commands and options ([66f48d8](https://github.com/ionic-team/ionic-cli/commit/66f48d8))
* **shell:** error for subprocesses that exit via signal ([3af1cee](https://github.com/ionic-team/ionic-cli/commit/3af1cee))




<a name="1.4.0"></a>
# [1.4.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.3.0...@ionic/cli-framework@1.4.0) (2018-11-20)


### Bug Fixes

* **config:** rewrite config for not found & syntax errors ([13298f1](https://github.com/ionic-team/ionic-cli/commit/13298f1))
* **terminal:** expand upon and fix Windows shell detection ([c3aa5a1](https://github.com/ionic-team/ionic-cli/commit/c3aa5a1)), closes [/github.com/ionic-team/ionic-cli/commit/dcc912d889011afd5944eaf4829bc8e5b4d0f4b6#commitcomment-31280556](https://github.com//github.com/ionic-team/ionic-cli/commit/dcc912d889011afd5944eaf4829bc8e5b4d0f4b6/issues/commitcomment-31280556)


### Features

* **help:** spec for customizing option help schema ([73830bc](https://github.com/ionic-team/ionic-cli/commit/73830bc))




<a name="1.3.0"></a>
# [1.3.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.2.0...@ionic/cli-framework@1.3.0) (2018-11-04)


### Bug Fixes

* **start:** fix stdio freezing issue on Windows ([#3725](https://github.com/ionic-team/ionic-cli/issues/3725)) ([a570770](https://github.com/ionic-team/ionic-cli/commit/a570770))


### Features

* **fn:** add function for resolving values from function series ([ac97f78](https://github.com/ionic-team/ionic-cli/commit/ac97f78))




<a name="1.2.0"></a>
# [1.2.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.1.1...@ionic/cli-framework@1.2.0) (2018-10-31)


### Bug Fixes

* **config:** write json file with ending newline ([dc3f2a5](https://github.com/ionic-team/ionic-cli/commit/dc3f2a5))
* **help:** filter out unnecessary global options ([7809c99](https://github.com/ionic-team/ionic-cli/commit/7809c99))
* **process:** keep node running for `sleepForever()` ([ea08f8d](https://github.com/ionic-team/ionic-cli/commit/ea08f8d))


### Features

* **namespace:** add `useAliases` option to `locate()` ([489617b](https://github.com/ionic-team/ionic-cli/commit/489617b))
* **object:** add `keysWithoutAliases()` method to `AliasedMap` ([f4807f4](https://github.com/ionic-team/ionic-cli/commit/f4807f4))
* **terminal:** detect windows shell ([dcc912d](https://github.com/ionic-team/ionic-cli/commit/dcc912d))




<a name="1.1.1"></a>
## [1.1.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.1.0...@ionic/cli-framework@1.1.1) (2018-10-05)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.1.0"></a>
# [1.1.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.7...@ionic/cli-framework@1.1.0) (2018-10-03)


### Features

* **shell:** accept pathed name ([7e6c713](https://github.com/ionic-team/ionic-cli/commit/7e6c713))
* **shell:** provide which utility for finding binaries ([4dbe922](https://github.com/ionic-team/ionic-cli/commit/4dbe922))




<a name="1.0.7"></a>
## [1.0.7](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.6...@ionic/cli-framework@1.0.7) (2018-09-05)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.0.6"></a>
## [1.0.6](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.5...@ionic/cli-framework@1.0.6) (2018-08-20)


### Bug Fixes

* **process:** catch and log errors in exit queue ([f3cd886](https://github.com/ionic-team/ionic-cli/commit/f3cd886))




<a name="1.0.5"></a>
## [1.0.5](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.4...@ionic/cli-framework@1.0.5) (2018-08-09)


### Bug Fixes

* **serve:** fix unclosed connection issue again ([#3500](https://github.com/ionic-team/ionic-cli/issues/3500)) ([1f0ef3b](https://github.com/ionic-team/ionic-cli/commit/1f0ef3b))




<a name="1.0.4"></a>
## [1.0.4](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.3...@ionic/cli-framework@1.0.4) (2018-08-07)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.0.3"></a>
## [1.0.3](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.2...@ionic/cli-framework@1.0.3) (2018-08-06)


### Bug Fixes

* **serve:** properly cleanup child processes ([#3481](https://github.com/ionic-team/ionic-cli/issues/3481)) ([38217bf](https://github.com/ionic-team/ionic-cli/commit/38217bf))
* **serve:** use 127.0.0.1 to attempt connections ([#3476](https://github.com/ionic-team/ionic-cli/issues/3476)) ([12c3f35](https://github.com/ionic-team/ionic-cli/commit/12c3f35))




<a name="1.0.2"></a>
## [1.0.2](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.1...@ionic/cli-framework@1.0.2) (2018-08-02)


### Bug Fixes

* **serve:** check all network interfaces for an available port ([30fd6ef](https://github.com/ionic-team/ionic-cli/commit/30fd6ef))




<a name="1.0.1"></a>
## [1.0.1](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.0...@ionic/cli-framework@1.0.1) (2018-07-30)




**Note:** Version bump only for package @ionic/cli-framework

<a name="1.0.0"></a>
# [1.0.0](https://github.com/ionic-team/ionic-cli/compare/@ionic/cli-framework@1.0.0-rc.13...@ionic/cli-framework@1.0.0) (2018-07-25)




**Note:** Version bump only for package @ionic/cli-framework
