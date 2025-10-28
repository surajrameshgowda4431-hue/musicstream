import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import './Premium.css';

const stripePromise = loadStripe('pk_test_51SMrjL8jmvaQwCaMDHHOCXMd5P4dn9vYtjnGZuwy08gXcGF3JytgUKPFL9ZHFKsGpV7rpHv3KS0sIXkuJvZRNdvC00c7QeqUqd');

const Premium = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { name: 'Monthly', price: 199, period: 'month' },
    { name: 'Yearly', price: 1999, period: 'year', savings: 'Save 17%' }
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    alert('Payment successful! Welcome to Premium!');
    setShowPayment(false);
    // Here you can redirect or update user status
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  return (
    <div className="premium-page">
      {!showPayment ? (
        <>
          <h1>Upgrade to Premium</h1>
          <div className="premium-benefits">
            <h2>Premium Features</h2>
            <ul>
              <li>✓ Ad-free listening</li>
              <li>✓ Unlimited skips</li>
              <li>✓ High-quality audio</li>
              <li>✓ Offline downloads</li>
              <li>✓ Create unlimited playlists</li>
            </ul>
          </div>
          
          <div className="pricing-plans">
            {plans.map((plan, idx) => (
              <div key={idx} className="plan-card">
                <h3>{plan.name}</h3>
                <div className="price">₹{plan.price}</div>
                <div className="period">per {plan.period}</div>
                {plan.savings && <div className="savings">{plan.savings}</div>}
                <button onClick={() => handleSelectPlan(plan)}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={selectedPlan.price}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />
        </Elements>
      )}
    </div>
  );
};

export default Premium;