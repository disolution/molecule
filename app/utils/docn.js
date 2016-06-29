/*
  DOCN repository read/write module
  (c) copyright Henry Kehlmann (MIT license)
 */
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';

export const docnJSON = 'project.json';  // MAIN GIT DOCN PROJECT DEFINITION FILE
export const docnReadme = 'README.md';         // MAIN GIT DOCN PROJECT README FILE
export const docnImage = 'cover-image';        // MAIN GIT DOCN PROJECT COVER IMAGE + FILE EXT

export const definitionPath = (uPath) => path.join(uPath, docnJSON);
export const readmePath = (uPath) => path.join(uPath, docnReadme);
export const coverPath = (uPath, project = {}) =>
  path.join(uPath,
    docnImage +
    (project.coverImage ? path.extname(project.coverImage) : '')
  );

export function saveProject(uPath, project = {}) {
  const docnPath = definitionPath(uPath);
  const mdPath = readmePath(uPath);

  return writeProject(docnPath, project)
  .then(() => writeReadme(mdPath, project));
}

export function writeProject(docnPath, project = {}) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(docnPath, project, { spaces: 4 }, (err) => {
      if(err) reject(err);
      resolve(docnPath);
    });
  });
}

export function writeReadme(mdPath, project = {}) {
  const content = buildReadme(project);
  return new Promise((resolve, reject) => {
    fs.writeFile(mdPath, content, (err) => {
      if(err) reject(err);
      resolve(mdPath);
    });
  });
}

export function writeCover(filePath, newPath) {
  return new Promise((resolve, reject) => {
    fs.copy(filePath, newPath, (err) => {
      if(err) reject(err);
      resolve(newPath);
    });
  });
}

// DOCN README.md
// Human-readable markdown presentation of a DOCN project
export function buildReadme({ title, coverImage, article }) {
  const parts = [
    `# ${title}`,
    (coverImage ? `![Cover](${coverImage})` : ''),
    `\n${article}`
  ];
  return parts.filter(p => p.length).join('\n');
}