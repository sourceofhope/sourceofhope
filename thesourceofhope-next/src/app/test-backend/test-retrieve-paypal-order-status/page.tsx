'use client';

import { useMemo, useState } from 'react';

export default function TestRetrievePaypalOrderStatusPage() {
	const [endpoint, setEndpoint] = useState('/api/checkout/retrieve-paypal-order-status');
	const [method, setMethod] = useState<'GET' | 'POST'>('GET');
	const [token, setToken] = useState('MOCK_PAYPAL_ORDER_ID');
	const [loading, setLoading] = useState(false);
	const [statusCode, setStatusCode] = useState<number | null>(null);
	const [responseBody, setResponseBody] = useState('');
	const [requestError, setRequestError] = useState('');

	const canSubmit = useMemo(() => endpoint.trim().length > 0 && token.trim().length > 0, [endpoint, token]);

	const handleSendRequest = async () => {
		setRequestError('');
		setStatusCode(null);
		setResponseBody('');

		try {
			setLoading(true);

			let url = endpoint.trim();
			let options: RequestInit = { method };

			if (method === 'GET') {
				const separator = url.includes('?') ? '&' : '?';
				url = `${url}${separator}token=${encodeURIComponent(token.trim())}`;
			} else {
				options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ token: token.trim() }),
				};
			}

			const response = await fetch(url, options);
			setStatusCode(response.status);

			const text = await response.text();
			try {
				setResponseBody(JSON.stringify(JSON.parse(text), null, 2));
			} catch {
				setResponseBody(text || '(empty response body)');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown request error';
			setRequestError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>Test Retrieve PayPal Order Status</h1>
			<p style={{ marginBottom: 18 }}>
				Simple tester for your Next.js API route with mock token data.
			</p>

			<section style={{ marginBottom: 12 }}>
				<label htmlFor="endpoint" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Endpoint
				</label>
				<input
					id="endpoint"
					type="text"
					value={endpoint}
					onChange={(event) => setEndpoint(event.target.value)}
					style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
				/>
			</section>

			<section style={{ marginBottom: 12 }}>
				<label htmlFor="method" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Method
				</label>
				<select
					id="method"
					value={method}
					onChange={(event) => setMethod(event.target.value as 'GET' | 'POST')}
					style={{ width: 180, padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
				>
					<option value="GET">GET</option>
					<option value="POST">POST</option>
				</select>
			</section>

			<section style={{ marginBottom: 16 }}>
				<label htmlFor="token" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Mock Token / Order ID
				</label>
				<input
					id="token"
					type="text"
					value={token}
					onChange={(event) => setToken(event.target.value)}
					style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #d1d5db' }}
				/>
			</section>

			<button
				type="button"
				onClick={handleSendRequest}
				disabled={loading || !canSubmit}
				style={{
					padding: '10px 16px',
					borderRadius: 8,
					border: 'none',
					background: loading || !canSubmit ? '#9ca3af' : '#2563eb',
					color: '#fff',
					cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
				}}
			>
				{loading ? 'Sending...' : `Send ${method} Request`}
			</button>

			{requestError && (
				<p style={{ marginTop: 14, color: '#b91c1c', fontWeight: 600 }}>Request Error: {requestError}</p>
			)}

			<section style={{ marginTop: 20 }}>
				<h2 style={{ fontSize: 20, marginBottom: 8 }}>Response</h2>
				<p style={{ marginBottom: 8 }}>
					<strong>Status:</strong> {statusCode ?? '-'}
				</p>
				<pre
					style={{
						background: '#111827',
						color: '#f9fafb',
						padding: 12,
						borderRadius: 8,
						overflowX: 'auto',
						minHeight: 100,
					}}
				>
					{responseBody || '(no response yet)'}
				</pre>
			</section>
		</main>
	);
}
