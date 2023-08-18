import * as vscode from "vscode";

//初始化 defitionfilecache， 保存搜索内容和location数组
class PeekFileBaseProvider {
  protected locations: vscode.Location[];
  protected filePatterns: vscode.GlobPattern[];
  protected matchPattern: RegExp;

  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    this.locations = [];
    this.filePatterns = filePatterns;
    this.matchPattern = new RegExp(matchPattern, 'i');
  }

  protected async handleFile(file: vscode.Uri, word: string) {
    try {
      const fileContentBytes = await vscode.workspace.fs.readFile(file);
      const fileContent = Buffer.from(fileContentBytes).toString("utf8");
      if (this.matchPattern.test(fileContent)) {
        this.locations.push(
          new vscode.Location(file, new vscode.Position(0, 0))
        );
      }
    } catch (error) {
      console.error(`Error reading file: ${file.fsPath}`, error);
    }
  }

  protected async traverseFiles(word: string) {
    const files = await this.findFiles();
    for await (const file of this.iterateFiles(files, word)) {
      await this.handleFile(file, word);
    }
  }

  private async findFiles(): Promise<vscode.Uri[]> {
    const patternFilesPromises = this.filePatterns.map((pattern) => {
      console.log(`Searching files with pattern: ${pattern}`);
      return vscode.workspace.findFiles(pattern);
    });
    console.log(patternFilesPromises.toString());
    const patternFilesArrays = await Promise.all(patternFilesPromises);
    console.log('Pattern files:', patternFilesArrays);
    const files = patternFilesArrays.flat();
    console.log('Found files:', files);
    return files;
  }

  private async *iterateFiles(
    files: vscode.Uri[],
    word: string
  ): AsyncIterableIterator<vscode.Uri> {
    for (const file of files) {
      yield file;
    }
  }

  protected async provide(document: vscode.TextDocument,
    position: vscode.Position) {
    const word = document.getText(document.getWordRangeAtPosition(position));
    this.matchPattern = new RegExp(
      this.matchPattern.source.replace(/{word}/i, word), 'i'
    );
    await this.traverseFiles(word);
  }
}

class PeekFileDefinitionProvider
  extends PeekFileBaseProvider
  implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Location[] | undefined> {
    await this.provide(document, position);
    const res = this.locations;
    this.locations = [];
    return res;
  }
}

class PeekFileImplementationProvider
  extends PeekFileBaseProvider
  implements vscode.ImplementationProvider {
  async provideImplementation(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<vscode.Location[] | undefined> {
    await this.provide(document, position);
    const res = this.locations;
    this.locations = [];
    return res;
  }
}

class PeekFileDeclarationProvider
  extends PeekFileBaseProvider
  implements vscode.DeclarationProvider {
  async provideDeclaration(
    document: vscode.TextDocument,
    position: vscode.Position
  ): Promise<
    vscode.Location | vscode.Location[] | vscode.LocationLink[] | undefined
  > {
    await this.provide(document, position);
    const res = this.locations;
    this.locations = [];
    return res;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode_peek");
  const activeLanguages = config.get("activeLanguages") as string[];

  const definitionFilePatterns = config.get(
    "definitionFilePatterns"
  ) as vscode.GlobPattern[];
  const definitionMatchPattern = config.get(
    "definitionMatchPattern") as string;

  const implementationFilePatterns = config.get(
    "ImplementationFilePatterns"
  ) as vscode.GlobPattern[];
  const implementationMatchPattern = config.get(
    "ImplementationMatchPattern"
  ) as string;

  const declarationFilePatterns = config.get(
    "declarationFilePatterns"
  ) as vscode.GlobPattern[];
  const declarationMatchPattern = config.get(
    "declarationMatchPattern"
  ) as string;

  const peekFilter: vscode.DocumentFilter[] = activeLanguages.map(
    (language) => ({
      language,
      scheme: "file",
    })
  );

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      peekFilter,
      new PeekFileDefinitionProvider(
        definitionFilePatterns,
        definitionMatchPattern
      )
    )
  );

  context.subscriptions.push(
    vscode.languages.registerImplementationProvider(
      peekFilter,
      new PeekFileImplementationProvider(
        implementationFilePatterns,
        implementationMatchPattern
      )
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDeclarationProvider(
      peekFilter,
      new PeekFileDeclarationProvider(
        declarationFilePatterns,
        declarationMatchPattern
      )
    )
  );

  console.log("Extension activated");
}

export function deactivate() {
  console.log("Extension deactivated");
}