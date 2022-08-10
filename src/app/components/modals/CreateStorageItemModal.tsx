import React from 'react';
import setValue from 'deep-set-in';
import deepClone from 'lodash.clonedeep';
import Modal from '../Modal';
import Heading from '../Heading';
import StorageItemForm from '../StorageItemForm';
import useRemoteTokens from '../../store/remoteTokens';
import Stack from '../Stack';
import { StorageTypeFormValues } from '@/types/StorageType';
import { StorageProviderType } from '@/constants/StorageProviderType';

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  storageProvider: StorageProviderType
};

export default function CreateStorageItemModal({
  isOpen, onClose, onSuccess, storageProvider,
}: Props) {
  const { addNewProviderItem } = useRemoteTokens();
  const [hasErrored, setHasErrored] = React.useState(false);

  const [formFields, setFormFields] = React.useState<StorageTypeFormValues<true>>(React.useMemo(() => ({
    provider: storageProvider,
  }), [storageProvider]));

  const handleCreateNewClick = React.useCallback(async (values: StorageTypeFormValues<false>) => {
    setHasErrored(false);
    const response = await addNewProviderItem(values);
    if (response) {
      onSuccess();
    } else {
      setHasErrored(true);
    }
  }, [addNewProviderItem, onSuccess]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const shallowObj = deepClone(formFields);
    setValue(shallowObj, e.target.name, e.target.value);
    setFormFields(shallowObj);
  }, [formFields]);

  const handleSubmit = React.useCallback((values: StorageTypeFormValues<false>) => {
    handleCreateNewClick(values);
  }, [handleCreateNewClick]);

  return (
    <Modal large isOpen={isOpen} close={onClose}>
      <Stack direction="column" gap={4}>
        <Heading>Add new credentials</Heading>
        <StorageItemForm
          isNew
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={onClose}
          values={formFields}
          hasErrored={hasErrored}
        />
      </Stack>
    </Modal>
  );
}
