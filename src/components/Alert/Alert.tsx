import { useRef } from 'react';

import { SnackbarProvider, closeSnackbar } from 'notistack';
import { MaterialDesignContent } from 'notistack';
import styled from 'styled-components';

import { XMarkIcon } from '@heroicons/react/24/solid';

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  '&.notistack-MuiContent-default': {
    backgroundColor: '#FFFFFF',
    color: 'black',
    minWidth: 0,
    width: 250,
    marginLeft: 40,
    borderRadius: 12
  }
}));

export default function AlertProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const notifyRef = useRef<any>();

  return (
    <SnackbarProvider
      dense
      maxSnack={3}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      ref={notifyRef}
      action={(snackbarId) => (
        <button
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          <XMarkIcon className="w-4 h-4 mr-2 hover:text-blue-500" />
        </button>
      )}
      preventDuplicate
      autoHideDuration={3000}
      Components={{
        default: StyledMaterialDesignContent
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
