import React from 'react';

interface Plan {
  id: string;
  name: string;
  description: string;
  image: string;
  logo: string;
}

const RecommendedPlans: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 'healthshield',
      name: 'HealthShield Pro',
      description: 'Comprehensive coverage for individuals and families.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwm2Wa0Zo3YSr0sOf25e8FFTq0cfu0pzYE42_AhIVeO5z61y040E4rB1iNo4RxA3zpwBEatF_lqisD09bGM1y75BQ6w29SZxy3zO68--CLt04AkwJyrYW9BKucBtUmwD1LBxl9wdjfh6CFq8_Js_0oxbY7UCjg7WeRUHwtrLYT2n_4IMukvBjBk6XduDQ4uWlpOFq93R4T1xZJaDezvYwrQNOHNMLTricCqyPWHcVZyBdKmBeu3zK0zZj5mVxQynmfBAayomrBQxmm',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATrkSaVuKTToaqG9x9AB9WguSXzGTX56cmTkOVrF5S0Hrzf9UV7MH2slEIlRYKm2AvjxLeY3TlfahGauPxWQY57VxiZehlv9v8PdJHTmKNlt_JOYwLEn-cARuxG2HrQPj3WGJv1poik0n_K_NiZzxyR8_Xe92A7eJdJtrveS38Hprfno_x7TpGiVmvwY9bc3oDp-c54cpxAxReew0gWoiAKcAQ4QYXCe4brSa9Bc3V9pJQbm7DHrURIGzK_gWVOwCwrvaQ2b3HiNbk'
    },
    {
      id: 'wellness',
      name: 'WellnessPlus Secure',
      description: 'A flexible plan focused on preventative care.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLZngkgLQL9eHXHHwMnoHVioRC2E0OguQJ5imGkOXB-UTjXwUGmBRVBilECSM5prLG_ZC0nxx4y-_Sp16o0JCRWA5pusIMiClcbWzOTY9_ntaZvTZIiLq3pIAe0NbjQMqTuDKFXGNUifBNB-qoAcp5FNr13DcjZN42JAHyQ7J9n8Haxng1DgASR8GWvxIyI_c_BxcpdIeJsI2hCk38AH6tw2yWCh9QCgrCdHUgb1BRzrHpRatKM21UQt2akyqMbnQkqODlJvIU1P0q',
      logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg2KIlf6Df1XX5GllM0mN0R0C_SPxQjGXVKu_Itvsthh1mJI_9iWmFHw7grmMRWwk6e--3WImtw5xwbm_IgK_d-H5jjnvV_5hsbbPSSg_MF9v18psBCFMdI6NxDI1taV4tyd91kzK81Ta8RHmzu0G_3iZG-8ah8cQDGQgy6KS8mOHaVznfVb7m2LnlQLxwJ6se1G18tMRnMaPODWtoyRexdGUpG42gW8TqP8FWPMNFa9gtC-7xLUiFocQUCXNchgc3iR-bXsMwIhMT'
    }
  ];

  return (
    <div className="recommended-plans">
      <div className="plans-header">
        <h3 className="plans-title">Recommended Plans</h3>
        <button className="view-all-button">
          View All →
        </button>
      </div>
      
      <div className="plans-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="plan-card"
          >
            <div className="plan-image-container">
              <img
                src={plan.image}
                alt={`${plan.name} illustration`}
                className="plan-image"
              />
            </div>
            <div className="plan-content">
              <div className="plan-header">
                <img
                  src={plan.logo}
                  alt={`${plan.name} logo`}
                  className="plan-logo"
                />
                <h4 className="plan-name">{plan.name}</h4>
              </div>
              <p className="plan-description">{plan.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlans;