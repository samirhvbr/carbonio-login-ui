/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { queryHelpers, screen, waitFor } from '@testing-library/react';

import PageLayout from './page-layout';
import logoBlue3Dark from '../../assets/blue3-marca-branca.png';
import logoBlue3 from '../../assets/blue3-marca.png';
import faviconBlue3 from '../../assets/blue3-simbolo.png';
import * as loginServices from '../services/login-page-services';
import { setup } from '../tests/testUtils';

vi.mock('darkreader', () => ({
	auto: vi.fn(),
	disable: vi.fn(),
	enable: vi.fn(),
	setFetchMethod: vi.fn()
}));

const DOMAIN_NAME = 'example.test';
const DOMAIN_FAVICON = 'https://example.test/favicon.png';

describe('PageLayout', () => {
	test('renders the logo and form', () => {
		setup(<PageLayout version={3} isAdvanced={false} />);

		// Assert the presence of the logo image
		const logoImage = screen.getByTestId('logo');
		expect(logoImage).toBeInTheDocument();
		expect(logoImage).toHaveAttribute('src', logoBlue3);
		expect(document.title).toBe('Blue3');

		// Assert the presence of the form container
		const formContainer = screen.getByTestId('form-container');
		expect(formContainer).toBeInTheDocument();
	});

	test('renders the default copyright banner', () => {
		setup(<PageLayout version={1} isAdvanced={false} />);

		// Assert the presence of the default copyright banner
		const defaultBanner = screen.getByTestId('default-banner');
		expect(defaultBanner).toBeInTheDocument();
	});

	test('uses Blue3 when the advanced configuration has no branding', async () => {
		vi.spyOn(loginServices, 'getLoginConfig').mockResolvedValue({
			publicUrl: '/',
			zimbraDomainName: DOMAIN_NAME
		});
		setup(<PageLayout version={3} isAdvanced />);
		expect(await screen.findByTestId('logo')).toHaveAttribute('src', logoBlue3);
		expect(document.title).toBe('Blue3');
		expect(queryHelpers.queryByAttribute('href', document, faviconBlue3)).toHaveAttribute(
			'href',
			faviconBlue3
		);
	});

	test('uses the white Blue3 logo for the default dark branding', async () => {
		vi.spyOn(loginServices, 'getLoginConfig').mockResolvedValue({
			publicUrl: '/',
			zimbraDomainName: DOMAIN_NAME,
			carbonioWebUiDarkMode: true
		});
		setup(<PageLayout version={3} isAdvanced />);
		expect(await screen.findByTestId('logo')).toHaveAttribute('src', logoBlue3Dark);
	});

	test('keeps explicit domain branding', async () => {
		vi.spyOn(loginServices, 'getLoginConfig').mockResolvedValue({
			publicUrl: '/',
			zimbraDomainName: DOMAIN_NAME,
			carbonioWebUiTitle: 'Domain mail',
			carbonioWebUiLoginLogo: 'https://example.test/logo.png',
			carbonioWebUiFavicon: DOMAIN_FAVICON
		});
		setup(<PageLayout version={3} isAdvanced />);
		await waitFor(() => expect(document.title).toBe('Domain mail'));
		expect(screen.getByTestId('logo')).toHaveAttribute('src', 'https://example.test/logo.png');
		expect(queryHelpers.queryByAttribute('href', document, DOMAIN_FAVICON)).toHaveAttribute(
			'href',
			DOMAIN_FAVICON
		);
	});
});
