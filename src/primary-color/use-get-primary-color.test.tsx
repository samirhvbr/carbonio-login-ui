/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { renderHook } from '@testing-library/react-hooks';

import { useGetPrimaryColor } from './use-get-primary-color';
import * as darkMode from '../dark-mode/use-dark-mode';
import * as localStorage from '../local-storage/local-storage';
import { useLoginConfigStore } from '../store/login/store';

describe('Blue3 primary colors', () => {
	beforeEach(() => {
		vi.spyOn(localStorage, 'useLocalStorage').mockReturnValue([undefined, vi.fn()]);
		useLoginConfigStore.setState({
			carbonioWebUiPrimaryColor: undefined,
			carbonioWebUiDarkPrimaryColor: undefined
		});
	});

	it.each([false, true])(
		'replaces cached branding once configuration loads with dark mode %s',
		(enabled) => {
			vi.spyOn(localStorage, 'useLocalStorage').mockReturnValue([
				{ light: '#123456', dark: '#abcdef' },
				vi.fn()
			]);
			vi.spyOn(darkMode, 'useDarkMode').mockReturnValue({
				darkModeEnabled: enabled,
				darkReaderStatus: enabled ? 'enabled' : 'disabled'
			});
			useLoginConfigStore.setState({ loaded: true });
			const { result } = renderHook(useGetPrimaryColor);
			expect(result.current).toBe(enabled ? '#29abe2' : '#0071bc');
		}
	);

	it.each([false, true])('uses the Blue3 color with dark mode %s', (enabled) => {
		vi.spyOn(darkMode, 'useDarkMode').mockReturnValue({
			darkModeEnabled: enabled,
			darkReaderStatus: enabled ? 'enabled' : 'disabled'
		});
		const { result } = renderHook(useGetPrimaryColor);
		expect(result.current).toBe(enabled ? '#29abe2' : '#0071bc');
	});

	it.each([false, true])('keeps domain colors with dark mode %s', (enabled) => {
		vi.spyOn(darkMode, 'useDarkMode').mockReturnValue({
			darkModeEnabled: enabled,
			darkReaderStatus: enabled ? 'enabled' : 'disabled'
		});
		useLoginConfigStore.setState({
			carbonioWebUiPrimaryColor: '#123456',
			carbonioWebUiDarkPrimaryColor: '#abcdef'
		});
		const { result } = renderHook(useGetPrimaryColor);
		expect(result.current).toBe(enabled ? '#abcdef' : '#123456');
	});
});
