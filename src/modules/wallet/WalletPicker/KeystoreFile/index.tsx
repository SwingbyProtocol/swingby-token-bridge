import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import { DropZone } from './styled';

export const KeystoreFile = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  return (
    <DropZone {...getRootProps()} isDragActive={isDragActive}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <FormattedMessage id="bc-wallet.keystore.drop-active" />
      ) : (
        <FormattedMessage id="bc-wallet.keystore.drop-idle" />
      )}
    </DropZone>
  );
};
