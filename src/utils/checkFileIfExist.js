import fs from 'node:fs/promises';

const checkFileIfExist = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};

export default checkFileIfExist;
