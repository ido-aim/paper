// js module
// serve from GITHUB through STATICALLY
// i.e. https://cdn.statically.io/gh/ido-aim/paper/main/libs/mjs/modules.mjs

// getlink : fetch github links
const root = "https://ido-aim.github.io/"

function getLink(repo,folder,subfolder){
    // example  https://ido-aim.github.io/paper/dist/25_FEB_2022:Start/
    let url =  `${root}${repo}/${folder}/${subfolder}/`
    return url
  }

export {getLink}