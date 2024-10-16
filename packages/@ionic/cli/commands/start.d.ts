import { CommandInstanceInfo, CommandLineInputs, CommandLineOptions, CommandMetadata, CommandPreRun, ResolvedStarterTemplate, StarterManifest } from '../definitions';
import { Command } from '../lib/command';
export declare class StartCommand extends Command implements CommandPreRun {
    private canRemoveExisting;
    private schema?;
    getMetadata(): Promise<CommandMetadata>;
    startIdStart(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    startIdConvert(id: string): Promise<void>;
    /**
     * Check if we should use the wizard for the start command.
     * We should use if they ran `ionic start` or `ionic start --capacitor`
     * and they are in an interactive environment.
     */
    shouldUseStartWizard(inputs: CommandLineInputs, options: CommandLineOptions): Promise<boolean | "" | null | undefined>;
    preRun(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    getProjectType(): Promise<string>;
    run(inputs: CommandLineInputs, options: CommandLineOptions, runinfo: CommandInstanceInfo): Promise<void>;
    checkForExisting(projectDir: string): Promise<void>;
    findStarterTemplate(template: string, type: string, tag: string): Promise<ResolvedStarterTemplate>;
    validateProjectType(type: string): Promise<void>;
    validateProjectId(projectId: string): Promise<void>;
    loadManifest(manifestPath: string): Promise<StarterManifest | undefined>;
    performManifestOps(manifest: StarterManifest): Promise<void>;
    downloadStarterTemplate(projectDir: string, starterTemplate: ResolvedStarterTemplate): Promise<void>;
    showNextSteps(projectDir: string, cloned: boolean, linkConfirmed: boolean, isCapacitor: boolean): Promise<void>;
}
