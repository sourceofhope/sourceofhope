'use client';

import { useMemo, useState } from 'react';

const mockPayload = {
	items: [
		{
			name: 'Hope T-Shirt',
			size: 'M',
			price: 24.99,
			quantity: 1,
		},
		{
			name: 'Donation Sticker Pack',
			size: 'N/A',
			price: 5.0,
			quantity: 2,
		},
	],
	shippingMethod: 'Standard Shipping',
	shippingCost: 4.99,
	taxAmount: 2.5,
	processingFee: 1.25,
	successUrl: 'http://localhost:3000/success',
	cancelUrl: 'http://localhost:3000/cancel',
};

export default function TestCreatePaypalSessionPage() {
	const [endpoint, setEndpoint] = useState('/api/checkout/create-paypal-order');
	const [payloadText, setPayloadText] = useState(() => JSON.stringify(mockPayload, null, 2));
	const [loading, setLoading] = useState(false);
	const [statusCode, setStatusCode] = useState<number | null>(null);
	const [responseBody, setResponseBody] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');

	const isPayloadValidJson = useMemo(() => {
		try {
			JSON.parse(payloadText);
			return true;
		} catch {
			return false;
		}
	}, [payloadText]);

	const handleSendRequest = async () => {
		setErrorMessage('');
		setStatusCode(null);
		setResponseBody('');

		let parsedPayload: unknown;
		try {
			parsedPayload = JSON.parse(payloadText);
		} catch {
			setErrorMessage('Payload is not valid JSON.');
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(parsedPayload),
			});

			setStatusCode(response.status);

			const text = await response.text();
			try {
				const json = JSON.parse(text);
				setResponseBody(JSON.stringify(json, null, 2));
			} catch {
				setResponseBody(text || '(empty response body)');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown request error';
			setErrorMessage(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>Test PayPal Create Session Route</h1>
			<p style={{ marginBottom: 20 }}>
				Use this page to test POST requests to your Next.js API route with mock checkout data.
			</p>

			<section style={{ marginBottom: 16 }}>
				<label htmlFor="endpoint" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					API Endpoint
				</label>
				<input
					id="endpoint"
					type="text"
					value={endpoint}
					onChange={(event) => setEndpoint(event.target.value)}
					style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #d1d5db' }}
				/>
			</section>

			<section style={{ marginBottom: 16 }}>
				<label htmlFor="payload" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Mock JSON Payload
				</label>
				<textarea
					id="payload"
					value={payloadText}
					onChange={(event) => setPayloadText(event.target.value)}
					rows={18}
					style={{
						width: '100%',
						padding: '10px',
						borderRadius: 8,
						border: `1px solid ${isPayloadValidJson ? '#d1d5db' : '#ef4444'}`,
						fontFamily: 'monospace',
					}}
				/>
			</section>

			<button
				type="button"
				onClick={handleSendRequest}
				disabled={loading || !isPayloadValidJson}
				style={{
					padding: '10px 16px',
					borderRadius: 8,
					border: 'none',
					backgroundColor: loading || !isPayloadValidJson ? '#9ca3af' : '#2563eb',
					color: '#fff',
					cursor: loading || !isPayloadValidJson ? 'not-allowed' : 'pointer',
				}}
			>
				{loading ? 'Sending...' : 'Send POST Request'}
			</button>

			{errorMessage && (
				<p style={{ marginTop: 14, color: '#b91c1c', fontWeight: 600 }}>Request Error: {errorMessage}</p>
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
