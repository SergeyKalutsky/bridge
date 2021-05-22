import path from 'path'
let Git = require("nodegit");

let pathToRepo = path.resolve("./platformer");

const show_diffs = async () => {
  const repo = await Git.Repository.open(pathToRepo);
  
  // commit before last
  const from = await repo.getCommit('c0acd04cbe8f5dba93a38704dd3713b5da6302de');
  const fromTree = await from.getTree();
  
  // last commit
  const to = await repo.getCommit('8e5608ff06f6124c194fb22cc25f88d16696e8bc');
  const toTree = await to.getTree();

  const diff = await toTree.diff(fromTree);
  const res = await diff.toBuf(1)
  console.log(res)
}
show_diffs()