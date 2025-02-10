import React, { useState } from 'react';

interface StakingPlan {
  name: string;
  min: number;
  max: number;
  interest: number;
  term: number;
}

const stakingPlans: StakingPlan[] = [
  { name: 'Basic', min: 100, max: 4999, interest: 5, term: 3 },
  { name: 'Standard', min: 5000, max: 11400, interest: 8, term: 4 },
  { name: 'Premium', min: 11500, max: 100000000, interest: 10, term: 5 },
];

const Staking: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<StakingPlan | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleStake = () => {
    if (!selectedPlan) return;
    const min = selectedPlan.min;
    const max = selectedPlan.max;
    const stakeAmount = parseFloat(amount);

    if (isNaN(stakeAmount) || stakeAmount < min || stakeAmount > max) {
      alert(`Amount must be between $${min} and $${max}`);
      return;
    }

    setSuccessMessage(
      `Successfully staked $${stakeAmount} in ${selectedPlan.name} plan!`,
    );
    setTimeout(() => {
      setSelectedPlan(null);
      setSuccessMessage('');
    }, 2000);
  };

  return (
    <div className="w-full text-white/90 p-4">
      <h2 className="text-lg font-semibold mb-4">Staking Plans</h2>
      <div className="grid gap-4">
        {stakingPlans.map((plan, index) => (
          <div
            key={index}
            className="flex justify-between bg-bodydark2 p-4 rounded-lg text-sm cursor-pointer hover:bg-[#252627] transition"
            onClick={() => setSelectedPlan(plan)}
          >
            <div className="text-white/60 flex flex-col gap-y-2">
              <h3 className="text-xs text-green-300">Plan: {plan.name}</h3>
              <p className="text-xs font-medium">
                Min: ${plan.min} | Max: $
                {plan.max === 100000000 ? '100m' : plan.max}
              </p>
            </div>

            <div className="text-xs text-white/60 flex flex-col justify-between font-medium">
              <p>Daily Interest: {plan.interest}%</p>
              <p className="ml-auto">Term: {plan.term} days</p>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 customBlur">
          <div className="bg-[#1a1b1c] p-6 rounded-lg w-80 relative">
            <button
              className="absolute top-2 right-3 text-lg"
              onClick={() => setSelectedPlan(null)}
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold text-white/90">
              {selectedPlan.name} Stake
            </h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-3 input"
            />
            {successMessage && (
              <p className="text-green-500 text-sm mt-2">{successMessage}</p>
            )}
            <button
              className="px-5 py-1.5 bg-blue-600 text-white rounded-sm mt-4"
              onClick={handleStake}
            >
              Start Staking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staking;
