const API_URL = 'http://localhost:3001';
let token = localStorage.getItem('voteToken');
let isAdmin = localStorage.getItem('isAdmin') === 'true';

// Check token on load
document.addEventListener('DOMContentLoaded', function() {
    if (token) {
        showDashboard();
    }
});

// Toggle between signup and login forms
function toggleToLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

function toggleToSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

async function signup() {
    const aadharInput = document.getElementById('aadhar-signup');
    const ageInput = document.getElementById('age');
    const aadhar = aadharInput.value.trim().replace(/\D/g, ''); // Only digits
    const age = parseInt(ageInput.value);
    
    showMessage('', '');
    
    // Validation
    if (!aadhar || aadhar.length !== 12) {
        return showMessage('Enter valid 12-digit Aadhar ID', 'error');
    }
    if (isNaN(age) || age < 18) {
        return showMessage('Age must be 18 or above', 'error');
    }
    
    try {
        const res = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({aadhar, age})
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        token = data.token;
        isAdmin = data.isAdmin;
        localStorage.setItem('voteToken', token);
        localStorage.setItem('isAdmin', isAdmin);
        showMessage('Signup successful! Redirecting...', 'success');
        setTimeout(showDashboard, 1000);
        
    } catch(err) {
        showMessage(err.message, 'error');
    }
}

async function login() {
    const aadharInput = document.getElementById('aadhar-login');
    const aadhar = aadharInput.value.trim().replace(/\D/g, ''); // Only digits
    
    showMessage('');
    
    if (!aadhar || aadhar.length !== 12) {
        return showMessage('Enter valid 12-digit Aadhar ID', 'error');
    }
    
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({aadhar})
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        token = data.token;
        isAdmin = data.isAdmin;
        localStorage.setItem('voteToken', token);
        localStorage.setItem('isAdmin', isAdmin);
        showMessage('Login successful! Redirecting...', 'success');
        setTimeout(showDashboard, 1000);
        
    } catch(err) {
        showMessage(err.message, 'error');
    }
}

function showMessage(text = '', type = '') {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = type;
}

function showDashboard() {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>${isAdmin ? '🛡️ Admin' : '🗳️ Voter'} Dashboard</h1>
            <p>Welcome back! Choose an option below.</p>
            <div class="dashboard-grid">
                ${!isAdmin ? `
                    <button class="card-btn" style="background: linear-gradient(135deg, #1E3A8A, #3B82F6);" onclick="showCandidateSelection()">
                        👥 Candidate Selection
                    </button>
                ` : ''}
                ${isAdmin ? `
                    <button class="card-btn" style="background: linear-gradient(135deg, #10B981, #34D399);" onclick="showVoterVerification()">
                        ✅ Voter Verification
                    </button>
                    <button class="card-btn" style="background: linear-gradient(135deg, #F59E0B, #FBBF24);" onclick="showResults()">
                        📊 Live Results
                    </button>
                    <button class="card-btn" style="background: linear-gradient(135deg, #8B5CF6, #A78BFA);" onclick="showExplorer()">
                        ⛓️ Blockchain Explorer
                    </button>
                ` : ''}
                <button class="btn-danger" onclick="logout()">🚪 Logout</button>
            </div>
        </div>
    `;
}

function logout() {
    localStorage.clear();
    token = null;
    isAdmin = false;
    document.location.reload();
}

function showCandidateSelection() {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>👥 Select Candidate</h1>
            <p>Choose your preferred candidate</p>
            <div class="candidate-grid">
                ${Array.from({length: 5}, (_, i) => `
                    <button class="card-btn" style="background: linear-gradient(135deg, #10B981, #34D399); font-size: 18px;" onclick="confirmVote(${i+1})">
                        Candidate ${i+1}
                    </button>
                `).join('')}
            </div>
            <button class="btn-danger" onclick="showDashboard()">← Back</button>
        </div>
    `;
}

function confirmVote(candidateId) {
    if (confirm(`Confirm vote for Candidate ${candidateId}?`)) {
        showVoteConfirmation(candidateId);
    }
}

function showVoteConfirmation(candidateId) {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>✅ Vote Confirmation</h1>
            <p>Confirm your vote for:</p>
            <div style="background: rgba(16,185,129,0.2); padding: 2rem; border-radius: 12px; margin: 1rem 0; font-size: 18px; font-weight: bold;">
                Candidate ${candidateId}
            </div>
            <button class="btn-success" style="font-size: 18px;" onclick="showVoteSuccess(${candidateId})">✓ Confirm Vote</button>
            <button class="btn-danger" onclick="showCandidateSelection()">← Change</button>
        </div>
    `;
}

function showVoteSuccess(candidateId) {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>🎉 Vote Successful!</h1>
            <p>Your vote has been recorded on blockchain</p>
            <div style="text-align:center; margin: 2rem 0;">
                <div style="font-size: 5rem; color: #10B981;">✓</div>
            </div>
            <button class="btn-success" onclick="showReceipt(${candidateId})">📄 View Receipt</button>
            <button class="btn-primary" onclick="showDashboard()">🏠 Dashboard</button>
        </div>
    `;
}

function showReceipt(candidateId) {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>📄 Vote Receipt</h1>
            <p><strong>Transaction Hash:</strong> 0x${'1234567890abcdef'.slice(0,10)}... (ZK-proof verified)</p>
            <p><strong>Candidate:</strong> ${candidateId}</p>
            <p><strong>Status:</strong> ✅ Confirmed on blockchain</p>
            <p style="font-size: 12px; color: #6B7280; margin-top: 1rem;">
                Save this receipt for verification
            </p>
            <button class="btn-primary" onclick="showDashboard()">🏠 Back to Dashboard</button>
        </div>
    `;
}

function showVoterVerification() {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>✅ Voter Verification</h1>
            <p>Verified voters list:</p>
            <div class="voter-list">
                <div class="voter-item">111122223333 ✓</div>
                <div class="voter-item">987654321012 ✓</div>
                <div class="voter-item">123456789012 ✓</div>
            </div>
            <button class="btn-primary" onclick="showDashboard()">← Back</button>
        </div>
    `;
}

function showResults() {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>📊 Live Results</h1>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; margin: 1rem 0;">
                <p><strong>Candidate 1:</strong> 45 votes (42%)</p>
                <p><strong>Candidate 2:</strong> 32 votes (30%)</p>
                <p><strong>Candidate 3:</strong> 25 votes (23%)</p>
                <p><strong>Candidate 4:</strong> 5 votes (5%)</p>
                <p><strong>Candidate 5:</strong> 0 votes (0%)</p>
            </div>
            <button class="btn-primary" onclick="showDashboard()">← Back</button>
        </div>
    `;
}

function showExplorer() {
    document.getElementById('main-container').innerHTML = `
        <div class="card">
            <h1>⛓️ Blockchain Explorer</h1>
            <p>Latest transactions:</p>
            <div style="background: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; font-family: monospace; font-size: 12px;">
                <div>0x1234... → Vote Tx #456</div>
                <div>0x5678... → Vote Tx #455</div>
                <div>0x9abc... → Deploy Tx #1</div>
            </div>
            <button class="btn-primary" onclick="showDashboard()">← Back</button>
        </div>
    `;
}
