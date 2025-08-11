import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-sticky">
        {/* User profile */}
        <div className="sidebar-section">
          <div className="profile-card">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiDPFQQ1dM_YcoQXxIX4NqryKSJuZd2FgzGseCh55Ln_cVInrE0JMh6C2BOWkoCfC7DVvw-IsfAkgADLnTNoQbvPGzAJu-hdKROi-IpuR3WkN8yX-pKzCRWD10lCH0_vHX-QtpK4Wr3z15p2Qf63PWkBJhgaCoHwtjJnny1ZYU7Y4786MVQqKtmbDRnbxgEi2XWYDNBFOsNa2BR98JuSXgKfarlbIKP-AHhdlHD8L3hAsCec2TlSbrtFWxOSg_Pyi0_PGk2Gi8dMyq" 
              alt="User avatar" 
              className="profile-avatar"
            />
            <div className="profile-info">
              <div className="profile-name">Ryan Mitchell</div>
              <div className="profile-role">Insurance Agent</div>
            </div>
          </div>
          <button className="new-chat-button">
            <span className="material-icons">add</span>
            New Chat
          </button>
        </div>

        {/* Navigation - temporal sections */}
        <div className="sidebar-section chat-history-section">
          <div className="chat-section">
            <h2 className="section-title">TODAY</h2>
            <ul className="chat-list">
              <li>
                <button className="chat-item active" onClick={() => {}}>
                  Choosing a Health Plan
                </button>
              </li>
            </ul>
          </div>
          
          <div className="chat-section">
            <h2 className="section-title">YESTERDAY</h2>
            <ul className="chat-list">
              <li>
                <button className="chat-item" onClick={() => {}}>
                  Compare Life Insurance
                </button>
              </li>
              <li>
                <button className="chat-item" onClick={() => {}}>
                  Auto Insurance FAQs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Utilities pinned bottom */}
        <div className="sidebar-utilities">
          <div className="upgrade-card">
            <h3 className="upgrade-title">Upgrade to Pro</h3>
            <p className="upgrade-description">
              Enjoy faster time reply, image generations and more advanced system experience.
            </p>
            <button className="upgrade-button">Learn More</button>
          </div>
          
          <nav className="utility-nav">
            <button className="utility-item" onClick={() => {}}>
              <span className="material-icons">settings</span>
              Settings
            </button>
            <button className="utility-item" onClick={() => {}}>
              <span className="material-icons">download</span>
              Download for iOS
            </button>
            <button className="utility-item" onClick={() => {}}>
              <span className="material-icons">policy</span>
              AI Policy
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;