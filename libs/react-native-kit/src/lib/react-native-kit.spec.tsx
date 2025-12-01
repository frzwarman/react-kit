import React from 'react';
import { render } from '@testing-library/react-native';
import ReactNativeKit from './react-native-kit';

describe('ReactNativeKit', () => {
  it('should render successfully', () => {
    const { root } = render(< ReactNativeKit />);
    expect(root).toBeTruthy();
  });
});
