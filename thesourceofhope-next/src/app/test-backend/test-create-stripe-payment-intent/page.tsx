'use client';

import { useMemo, useState } from 'react';

const mockPayload = {
	items: [
		{
			id: 'sku_donation_box',
			name: 'Donation Box',
			price: 35.5,
			quantity: 1,
		},
		{
			id: 'sku_support_kit',
			title: 'Support Kit',
			price: 12.25,
			quantity: 2,
		},
	],
	shippingMethod: 'Standard Shipping',
	shippingCost: 5.99,
	taxAmount: 3.88,
	processingFee: 1.45,
	shippingAddress: {
		firstName: 'Jane',
		lastName: 'Doe',
		address: '123 Hope Street',
		city: 'Dallas',
		state: 'TX',
		zipCode: '75001',
		country: 'US',
	},
	billingAddress: {
		firstName: 'Jane',
		lastName: 'Doe',
		address: '123 Hope Street',
		city: 'Dallas',
		state: 'TX',
		zipCode: '75001',
		country: 'US',
	},
	totalAmount: 71.32,
	email: 'jane.doe@example.com',
};

export default function TestCreateStripePaymentIntentPage() {
	const [endpoint, setEndpoint] = useState('/api/checkout/create-stripe-payment-intent');
	const [payloadText, setPayloadText] = useState(() => JSON.stringify(mockPayload, null, 2));
	const [loading, setLoading] = useState(false);
	const [statusCode, setStatusCode] = useState<number | null>(null);
	const [responseBody, setResponseBody] = useState('');
	const [requestError, setRequestError] = useState('');

	const isValidJson = useMemo(() => {
		try {
			JSON.parse(payloadText);
			return true;
		} catch {
			return false;
		}
	}, [payloadText]);

	const handleSendRequest = async () => {
		setRequestError('');
		setStatusCode(null);
		setResponseBody('');

		let parsedPayload: unknown;
		try {
			parsedPayload = JSON.parse(payloadText);
		} catch {
			setRequestError('Payload is not valid JSON.');
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
		<main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>Test Create Stripe Payment Intent</h1>
			<p style={{ marginBottom: 18 }}>
				Send mock checkout data to your Stripe payment intent API route and inspect the response.
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

			<section style={{ marginBottom: 16 }}>
				<label htmlFor="payload" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Mock JSON Payload
				</label>
				<textarea
					id="payload"
					rows={20}
					value={payloadText}
					onChange={(event) => setPayloadText(event.target.value)}
					style={{
						width: '100%',
						padding: 10,
						borderRadius: 8,
						border: `1px solid ${isValidJson ? '#d1d5db' : '#ef4444'}`,
						fontFamily: 'monospace',
					}}
				/>
			</section>

			<button
				type="button"
				onClick={handleSendRequest}
				disabled={loading || !isValidJson}
				style={{
					padding: '10px 16px',
					borderRadius: 8,
					border: 'none',
					background: loading || !isValidJson ? '#9ca3af' : '#2563eb',
					color: '#fff',
					cursor: loading || !isValidJson ? 'not-allowed' : 'pointer',
				}}
			>
				{loading ? 'Sending...' : 'Send POST Request'}
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
