import React from 'react';
import { Label, CategoryButtonContainer, CategoryButton, InputContainer } from './styled';

interface CategorySelectorProps {
  categories: string[];
  taskCategory: string;
  setTaskCategory: (value: string) => void;
  readOnly?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  taskCategory,
  setTaskCategory,
  readOnly = false,
}) => {
  if (readOnly) {
    return (
      <InputContainer>
        <Label>Category</Label>
        <p style={{ marginTop: '0.3rem', fontSize: '0.6em' }}>{taskCategory || 'None'}</p>
      </InputContainer>
    );
  }

  return (
    <InputContainer>
      <Label>Category</Label>
      <CategoryButtonContainer>
        <CategoryButton
          type='button'
          selected={taskCategory === 'None'}
          onClick={() => setTaskCategory('None')}
        >
          None
        </CategoryButton>

        {categories.map((cat) => (
          <CategoryButton
            key={cat}
            type='button'
            selected={taskCategory === cat}
            onClick={() => setTaskCategory(cat)}
          >
            {cat}
          </CategoryButton>
        ))}
      </CategoryButtonContainer>
    </InputContainer>
  );
};

export default CategorySelector;
