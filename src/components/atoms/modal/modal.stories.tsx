import {
  useState,
} from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Clipboard } from '../clipboard/clipboard';
import { Modal } from './modal';
import { Socials } from '../socials/socials';

export default {
  title: 'Atoms/Modal',
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => { setShowModal(true); }}>Modal Link</button>
      <Modal {...args} open={showModal} onModalClose={() => { setShowModal(false); }} />
    </>
  );
};

export const ModalContainer = Template.bind({});
ModalContainer.args = {
  modalTitle: 'This is a title',
  children: (<>This is content</>),
};
