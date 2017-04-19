
import { DiffPatcher } from 'jsondiffpatch/src/diffpatcher';

const patcher = new DiffPatcher();

const defaults = {

  // temp files store
  files : { },

  // file template
  file  : {
    name        : '',
    size        : '',
    width       : 200,
    height      : 200,
    type        : '',
    url         : '',
    base64      : '',
    lastModified: 0,
    progress    : 0,
    error       : null,
  },

}

export const actions = {
  UploadFile: '@@file/UPLOAD_FILE',
  UploadSuccessful: '@@file/UPLOAD_SUCCESSFUL',
  UploadFailure: '@@file/UPLOAD_FAILURE',
  UpdateState: '@@file/UPDATE_STATE',
};

function hookUploadFile(files, action, store) {
  const { base64, file, dimensions: { width, height } } = action.blob;
  const { name, size, type, lastModified } = file;
  const clone = patcher.clone(files);
  clone[name] = {
    ...defaults.file,
    file,
    name,
    size,
    width,
    height,
    type,
    base64,
    lastModified,
  };
  return clone;
}

function hookUpdateFile(files, action, store) {
  const { name, progress } = action;
  const clone = patcher.clone(files);
  const file = clone[name];
  file.progress = progress;
  return clone;
}

function hookUploadFailure(files, action, store) {
  const { name, error } = action;
  const clone = patcher.clone(files);
  const file = clone[name];
  file.error = error;
  return clone;
}

function hookUploadSuccessful(files, action, store) {
  const { name, url } = action;
  const clone = patcher.clone(files);
  const file = clone[name];
  file.progress = 100;
  file.url = url;
  return clone;
}

/**
 * files state
 */
function files (files = defaults.files, action = defaults.action, store) {

  switch ( action.type ) {

    case actions.UploadFile:
      return hookUploadFile(files, action, store);

    case actions.UpdateState:
      return hookUpdateFile(files, action, store);

    case actions.UploadFailure:
      return hookUploadFailure(files, action, store);

    case actions.UploadSuccessful:
      return hookUploadSuccessful(files, action, store);

    default:
      return files;

  }
}

/**
 * set editor state
 */
function upload(blob) {
  const { file } = blob;
  const { name } = file;
  return function ( dispatch, getState ) {
    return new Promise(resolve => {

      const { files } = getState();

      if ( files[name] && !files[name].error ) {
        return resolve(files[name]);
      }

      dispatch({ type: actions.UploadFile, blob });

      resolve(getState().files[name]);

      const form = new FormData();
      form.append('file', file);

      const req = new XMLHttpRequest();

      // util to parse message from string to JSON object
      const parse = e => {
        let res;
        try { res = JSON.parse(e) } catch (e) { res = e }
        return res;
      }

      req.addEventListener('load', e => {
        const res = parse(req.responseText);
        if ( req.status >= 200 && req.status <= 299 ) {
          const { id } = res;
          dispatch({ type: actions.UploadSuccessful, name, url: id });
        } else {
          dispatch({ type: actions.UploadFailure, name, error: res });
        }
      });

      req.addEventListener('error', e => {
        const error = parse(req.responseText);
        dispatch({ type: actions.UploadFailure, name, error });
      });

      req.upload.addEventListener('progress', e => {
        let progress = 0;
        if ( e.total !== 0 ) {
          progress = parseInt((e.loaded / e.total) * 100, 10);
        }
        dispatch({ type: actions.UpdateState, name, progress });
      });

      req.addEventListener('abort', e => {
        dispatch({ type: actions.UpdateState, name, progress: -1 });
      });

      req.open('POST', `${BACKEND_URL}/i/assets`);
      req.withCredentials = true;

      req.send(form);
    });
  }
}

/**
 * export store api
 */
export const api = {
  upload,
}

export default {
  files,
};
