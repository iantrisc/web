import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Error from './Error';

const InputContainer = styled.div`
  padding-bottom: 40px;
`;

const Label = styled.label`
  display: block;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
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

export default function Input(props) {
  const { label, type, value, isRequired, errorMsg, onChange, onBlur } = props;
  const [error, setError] = useState(false);

  return (
    <InputContainer>
      <Label>
        <p>{label}</p>
        <StyledInput
          type={type}
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
    </InputContainer>
  );
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  errorMsg: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

Input.defaultProps = {
  label: '',
  value: '',
  isRequired: false,
  errorMsg: '',
  onChange: () => {},
  onBlur: () => {},
};
