'use client';

import { useMemo, useState } from 'react';

export default function TestRetrieveStripePaymentIntentStatusPage() {
	const [endpoint, setEndpoint] = useState('/api/checkout/retrieve-stripe-payment-intent-status');
	const [paymentIntentId, setPaymentIntentId] = useState('pi_mock_payment_intent_id');
	const [loading, setLoading] = useState(false);
	const [statusCode, setStatusCode] = useState<number | null>(null);
	const [responseBody, setResponseBody] = useState('');
	const [requestError, setRequestError] = useState('');

	const canSubmit = useMemo(() => {
		return endpoint.trim().length > 0 && paymentIntentId.trim().length > 0;
	}, [endpoint, paymentIntentId]);

	const handleSendRequest = async () => {
		setRequestError('');
		setStatusCode(null);
		setResponseBody('');

		try {
			setLoading(true);

			const separator = endpoint.includes('?') ? '&' : '?';
			const url = `${endpoint.trim()}${separator}payment_intent=${encodeURIComponent(paymentIntentId.trim())}`;

			const response = await fetch(url, {
				method: 'GET',
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
		<main style={{ maxWidth: 860, margin: '0 auto', padding: 24 }}>
			<h1 style={{ fontSize: 28, marginBottom: 8 }}>Test Retrieve Stripe Payment Intent Status</h1>
			<p style={{ marginBottom: 18 }}>
				Simple tester for your Stripe payment intent status API route using a mock payment intent ID.
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
				<label htmlFor="paymentIntentId" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
					Mock Payment Intent ID
				</label>
				<input
					id="paymentIntentId"
					type="text"
					value={paymentIntentId}
					onChange={(event) => setPaymentIntentId(event.target.value)}
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
				{loading ? 'Sending...' : 'Send GET Request'}
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
