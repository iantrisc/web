import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Error from './Error';

const TextareaContainer = styled.div`
  padding-bottom: 40px;
`;

const Label = styled.label`
  display: block;
`;

const StyledTextarea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 250px;
  color: #fff;
  background-color: transparent;
  padding: 10px 15px;
  text-align: center;
  box-sizing: border-box;
  border: ${(props) => {
    if (props.error) return '1px solid #ff0000';

    return '1px solid rgba(255, 255, 255, 0.4)';
  }};
`;

export default function Textarea(props) {
  const { label, value, isRequired, errorMsg, onChange, onBlur } = props;
  const [error, setError] = useState(false);

  return (
    <TextareaContainer>
      <Label>
        <p>{label}</p>
        <StyledTextarea
          value={value}
          error={error && isRequired}
          onBlur={() => {
            if (isRequired) {
              if (value === '') setError(true);
              else setError(false);

              onBlur();
            }
          }}
          onChange={({ target }) => {
            onChange(target.value);
          }}
        />
      </Label>
      {error ? <Error>{errorMsg}</Error> : <div />}
    </TextareaContainer>
  );
}

Textarea.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Textarea.defaultProps = {
  label: '',
  value: '',
  isRequired: false,
  errorMsg: '',
  onChange: () => {},
  onBlur: () => {},
};
