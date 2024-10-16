import { Command, CommandLineInputs, CommandLineOptions, CommandMetadata } from '@ionic/cli-framework';
export declare class DocsCommand extends Command {
    getMetadata(): Promise<CommandMetadata>;
    run(inputs: CommandLineInputs, options: CommandLineOptions): Promise<void>;
    private extractCommand;
    private formatFootnotes;
    private extractInput;
    private extractOption;
}
