# SupportModal Component

A modal component for handling support requests, designed based on the Figma design specifications.

## Features

- **Request Subject Dropdown**: Allows users to select from predefined support categories
- **Description Text Field**: Multi-line text input for detailed request descriptions
- **Send Request Button**: Primary action button to submit the support request
- **Close Button**: Allows users to close the modal
- **Responsive Design**: Follows the project's design system and patterns

## Usage

### Basic Implementation

```tsx
import { useState } from "react";
import Modal from "../../common/components/Modal/Modal";
import SupportModal from "../../common/components/SupportModal/SupportModal";

const MyComponent = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleOnCloseModal = () => {
    setShowSupportModal(false);
  };

  const handleOnClickSupportButton = () => {
    setShowSupportModal(true);
  };

  return (
    <div>
      <button onClick={handleOnClickSupportButton}>
        Get Support
      </button>
      
      <Modal onClose={handleOnCloseModal} show={showSupportModal}>
        <SupportModal onClose={handleOnCloseModal} />
      </Modal>
    </div>
  );
};
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onClose` | `() => void` | Yes | Function to call when the modal should be closed |

## Design Specifications

- **Width**: 584px
- **Height**: 824px
- **Border Radius**: 24px
- **Background**: #FFFFFF
- **Shadow**: 0px 6px 58px 0px rgba(121, 145, 173, 0.2)
- **Font Family**: Nunito Sans

## Form Fields

### Request Subject
- **Type**: Dropdown/Select
- **Options**: Technical difficulties, Billing issues, Feature request, Bug report, Other
- **Default Placeholder**: "Technical difficulties"

### Description
- **Type**: Multi-line text input
- **Rows**: 6
- **Placeholder**: "Add some description of the request"

## Styling

The component follows the project's established patterns:
- Uses Material-UI components and styling
- Consistent with other modal components in the project
- Follows the same close button pattern as EmployeeForm and TaskForm
- Uses the project's color scheme and typography

## Integration

The SupportModal is designed to work with the existing Modal component and follows the same patterns used throughout the project for form modals.
