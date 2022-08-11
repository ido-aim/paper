// js helper module
// serve from GITHUB through STATICALLY
// i.e. https://cdn.statically.io/gh/ido-aim/paper/main/libs/mjs/modules.mjs

// getlink : fetch github links
const root = "https://ido-aim.github.io/"

// component load function
// function componentLoad(f,section,execute)

function getLink(repo,folder,subfolder){
    // example  https://ido-aim.github.io/paper/dist/25_FEB_2022:Start/
    let url =  `${root}${repo}/${folder}/${subfolder}/`
    return url
  }

async function listDir(user, repo, directory) {
  let url = `https://api.github.com/repos/${user}/${repo}/git/trees/main`;
  let list = await fetch(url).then(res => res.json());
  let dir = list.tree.find(node => node.path === directory);
  if (dir) {
     const list = await fetch(dir.url).then(res => res.json());
     return list.tree.map(node => node.path);
  }
}  

export {getLink,listDir}