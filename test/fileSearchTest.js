// import * as vscode from 'vscode';

// export function activate(context: vscode.ExtensionContext) {
//   let disposable = vscode.commands.registerCommand('extension.searchFiles', async () => {
//     try {
//       const files = await vscode.workspace.findFiles('**/*.js', '**/node_modules/**', 10);

//       // 处理找到的文件列表
//       files.forEach((file) => {
//         console.log('Found file:', file.fsPath);
//       });
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   });

//   context.subscriptions.push(disposable);
// }

// export function deactivate() {}