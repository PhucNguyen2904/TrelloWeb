"use client";

import React, { useState, useMemo } from 'react';
import './users.css';
import { 
  Users, 
  BarChart2, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Grid, 
  Plus, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Edit2, 
  Ban, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Star,
  User as UserIcon,
  CheckCircle,
  Clock,
  PieChart,
  ClipboardList
} from 'lucide-react';

// --- Types ---
type Role = 'Superadmin' | 'Admin' | 'User';
type Status = 'Active' | 'Inactive';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastActive: string;
  avatarColor: string;
}

// --- Mock Data ---
const MOCK_USERS: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@projectflow.com', role: 'Superadmin', status: 'Active', lastActive: '2 mins ago', avatarColor: '#7C3AED' },
  { id: '2', name: 'Marcus Thompson', email: 'm.thompson@projectflow.com', role: 'Admin', status: 'Inactive', lastActive: '4 days ago', avatarColor: '#1a73e8' },
  { id: '3', name: 'David Miller', email: 'd.miller@projectflow.com', role: 'Admin', status: 'Active', lastActive: '1 hour ago', avatarColor: '#10b981' },
  { id: '4', name: 'Emily Johnson', email: 'e.johnson@projectflow.com', role: 'User', status: 'Active', lastActive: '30 mins ago', avatarColor: '#f59e0b' },
  { id: '5', name: 'James Wilson', email: 'j.wilson@projectflow.com', role: 'User', status: 'Inactive', lastActive: '2 weeks ago', avatarColor: '#6B7280' },
];

// Additional mock data for pagination
const ALL_USERS = [...MOCK_USERS];
for (let i = 6; i <= 42; i++) {
  ALL_USERS.push({
    id: i.toString(),
    name: `User ${i}`,
    email: `user${i}@projectflow.com`,
    role: i % 5 === 0 ? 'Superadmin' : i % 3 === 0 ? 'Admin' : 'User',
    status: i % 4 === 0 ? 'Inactive' : 'Active',
    lastActive: `${i} days ago`,
    avatarColor: ['#7C3AED', '#1a73e8', '#10b981', '#f59e0b', '#6B7280'][i % 5]
  });
}

// --- Components ---

const RoleBadge = ({ role }: { role: Role }) => {
  const config = {
    Superadmin: { icon: <Star size={12} />, className: 'role-superadmin' },
    Admin: { icon: <Shield size={12} />, className: 'role-admin' },
    User: { icon: <UserIcon size={12} />, className: 'role-user' },
  };

  return (
    <div className={`role-badge ${config[role].className}`}>
      {config[role].icon}
      <span>{role}</span>
    </div>
  );
};

const StatusDot = ({ status }: { status: Status }) => (
  <div className={`status-cell ${status === 'Active' ? 'status-active' : 'status-inactive'}`}>
    <div className="status-dot"></div>
    <span>{status}</span>
  </div>
);

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filtered logic
  const filteredUsers = useMemo(() => {
    return ALL_USERS.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, roleFilter]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User' as Role,
    status: 'Active' as Status
  });

  const openModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'User',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      alert(`User ${id} deleted (Mock action)`);
    }
  };

  return (
    <div className="user-management-container">
      {/* 1. LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-block">
          <div className="logo-icon">
            <Grid size={20} />
          </div>
          <div className="logo-text">
            <h1>ProjectFlow</h1>
            <p>Engineering Team</p>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-item active">
            <Users size={20} />
            <span>Members</span>
          </div>
          <div className="nav-item">
            <BarChart2 size={20} />
            <span>Analytics</span>
          </div>
          <div className="nav-item">
            <Settings size={20} />
            <span>Workspace Settings</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <HelpCircle size={20} />
            <span>Help Center</span>
          </div>
          <div className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="main-content">
        {/* TOP HEADER */}
        <header className="top-header">
          <div className="search-wrapper">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search system settings..." 
              className="search-input"
            />
          </div>

          <div className="header-right">
            <div className="icon-btn"><Bell size={20} /></div>
            <div className="icon-btn"><HelpCircle size={20} /></div>
            <div className="icon-btn"><Grid size={20} /></div>
            <img 
              src="https://ui-avatars.com/api/?name=Admin+User&background=1a73e8&color=fff" 
              alt="User" 
              className="avatar"
            />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="page-container">
          <div className="page-header">
            <div className="header-title">
              <h2>Users</h2>
              <p>Manage platform members and their access permissions.</p>
            </div>
            <button className="btn-primary" onClick={() => openModal()}>
              <Plus size={20} />
              Create User
            </button>
          </div>

          {/* USERS TABLE CARD */}
          <div className="table-card">
            <div className="table-toolbar">
              <div className="toolbar-left">
                <div className="search-wrapper" style={{ width: '300px' }}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="toolbar-right">
                <button className="btn-outline">
                  <Filter size={18} />
                  Filters
                </button>
                <button className="btn-outline">
                  <Download size={18} />
                  Export
                </button>
              </div>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ backgroundColor: user.avatarColor }}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="user-info">
                          <span className="name">{user.name}</span>
                          <span className="email">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={user.role} />
                    </td>
                    <td>
                      <StatusDot status={user.status} />
                    </td>
                    <td>
                      <span className="last-active">{user.lastActive}</span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn" onClick={() => openModal(user)}><Edit2 size={16} /></button>
                        <button className="action-btn"><Ban size={16} /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="pagination-controls">
                <div className="page-num" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
                  <ChevronLeft size={18} />
                </div>
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
                  <div 
                    key={i + 1} 
                    className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </div>
                ))}
                {totalPages > 5 && <div className="page-num">...</div>}
                {totalPages > 5 && (
                  <div 
                    className={`page-num ${currentPage === totalPages ? 'active' : ''}`}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </div>
                )}
                <div className="page-num" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}>
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. SUMMARY CARDS */}
          <div className="summary-grid">
            {/* Card 1 */}
            <div className="summary-card">
              <div className="summary-header">
                <div className="summary-icon" style={{ backgroundColor: '#EBF3FF', color: '#1a73e8' }}>
                  <Users size={20} />
                </div>
                <span>Active Seats</span>
              </div>
              <div className="summary-value">32 / 50</div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: '64%', backgroundColor: '#1a73e8' }}></div>
              </div>
              <div className="summary-subtext">64% of license used</div>
            </div>

            {/* Card 2 */}
            <div className="summary-card">
              <div className="summary-header">
                <div className="summary-icon" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
                  <PieChart size={20} />
                </div>
                <span>Role Distribution</span>
              </div>
              <div className="stats-list">
                <div className="stats-item">
                  <div className="stats-dot" style={{ backgroundColor: '#7C3AED' }}></div>
                  <span className="stats-label">Superadmin</span>
                  <span className="stats-value">3 users</span>
                </div>
                <div className="stats-item">
                  <div className="stats-dot" style={{ backgroundColor: '#1a73e8' }}></div>
                  <span className="stats-label">Admin</span>
                  <span className="stats-value">12 users</span>
                </div>
                <div className="stats-item">
                  <div className="stats-dot" style={{ backgroundColor: '#6B7280' }}></div>
                  <span className="stats-label">User</span>
                  <span className="stats-value">27 users</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="summary-card">
              <div className="summary-header">
                <div className="summary-icon" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
                  <ClipboardList size={20} />
                </div>
                <span>Pending Invites</span>
              </div>
              <p className="pending-text">
                There are currently 4 pending workspace invitations.
              </p>
              <a href="#" className="view-link">View Invites →</a>
            </div>
          </div>
        </div>
      </main>

      {/* 5. MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Create User'}</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert('User saved (Mock)'); setIsModalOpen(false); }}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Role</label>
                  <RoleBadge role={formData.role} />
                </div>
                <select 
                  className="form-select" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value="Superadmin">★ Superadmin</option>
                  <option value="Admin">🛡️ Admin</option>
                  <option value="User">👤 User</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      className="switch-input" 
                      checked={formData.status === 'Active'}
                      onChange={e => setFormData({...formData, status: e.target.checked ? 'Active' : 'Inactive'})}
                    />
                    <div className="switch-slider"></div>
                  </label>
                  <span style={{ fontSize: '14px', color: formData.status === 'Active' ? 'var(--success)' : 'var(--text-muted)', fontWeight: 500 }}>
                    {formData.status}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
