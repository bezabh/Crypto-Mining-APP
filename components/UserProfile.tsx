
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { User as UserIcon, Phone, Calendar, Save, Edit2, Shield, Mail, MapPin, Globe, CreditCard, Camera, Upload } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.personalInfo?.phoneNumber || '',
    dob: user.personalInfo?.dateOfBirth || '',
    gender: user.personalInfo?.gender || 'Male',
    nationalId: user.personalInfo?.nationalId || '',
    country: user.location?.country || '',
    city: user.location?.city || ''
  });

  // Sync avatar if user prop updates externally
  useEffect(() => {
    setAvatarPreview(user.avatar || null);
  }, [user.avatar]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser: User = {
        ...user,
        name: formData.name,
        avatar: avatarPreview || undefined,
        personalInfo: {
            ...user.personalInfo,
            phoneNumber: formData.phone,
            dateOfBirth: formData.dob,
            gender: formData.gender,
            nationalId: formData.nationalId
        },
        location: {
            ...user.location!,
            country: formData.country,
            city: formData.city
        }
    };
    onUpdate(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex justify-between items-start mb-8 border-b border-slate-800 pb-4">
            <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <UserIcon className="text-indigo-500" /> Personal Profile
                </h3>
                <p className="text-slate-400 text-sm mt-1">Manage your personal identification and avatar.</p>
            </div>
            <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${isEditing ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
            >
                {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
            </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 md:w-1/3">
                <div className="relative group">
                    <div className={`w-40 h-40 rounded-full overflow-hidden border-4 shadow-2xl relative ${isEditing ? 'border-indigo-500' : 'border-slate-700'}`}>
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                <UserIcon size={64} className="text-slate-600" />
                            </div>
                        )}
                        
                        {/* Overlay for Editing */}
                        {isEditing && (
                            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Camera size={32} className="text-white mb-1" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Change</span>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>
                    {isEditing && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg pointer-events-none">
                            EDIT MODE
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-white">{formData.name || 'User'}</h2>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                        <Shield size={12} className="text-green-500" /> 
                        {user.role} Account
                    </div>
                </div>
            </div>

            {/* Form Fields Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 content-start">
                
                {/* Full Name */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">Full Name</label>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                        />
                    ) : (
                        <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent truncate">{formData.name}</div>
                    )}
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Mail size={12}/> Email Address</label>
                    <div className="text-slate-400 font-medium p-3 bg-slate-950/30 rounded-lg border border-slate-800 flex justify-between items-center opacity-80 cursor-not-allowed">
                        <span className="truncate">{user.email}</span>
                        {/* Fixed: Removed non-existent 'title' prop from Shield component */}
                        <Shield size={14} className="text-green-500 shrink-0" />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                    {isEditing ? (
                        <input 
                            type="tel" 
                            value={formData.phone} 
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                            placeholder="+1 234 567 890"
                        />
                    ) : (
                        <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent">
                            {formData.phone || <span className="text-slate-500 italic">Not set</span>}
                        </div>
                    )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={12}/> Date of Birth</label>
                    {isEditing ? (
                        <input 
                            type="date" 
                            value={formData.dob} 
                            onChange={(e) => handleChange('dob', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                        />
                    ) : (
                        <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent">
                            {formData.dob || <span className="text-slate-500 italic">Not set</span>}
                        </div>
                    )}
                </div>

                {/* Gender */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><UserIcon size={12}/> Gender</label>
                    {isEditing ? (
                        <select 
                            value={formData.gender} 
                            onChange={(e) => handleChange('gender', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent">
                            {formData.gender}
                        </div>
                    )}
                </div>

                {/* National ID */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><CreditCard size={12}/> National ID</label>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={formData.nationalId} 
                            onChange={(e) => handleChange('nationalId', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                            placeholder="ID Number"
                        />
                    ) : (
                        <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent font-mono">
                            {formData.nationalId ? '•••• •••• ' + formData.nationalId.slice(-4) : <span className="text-slate-500 italic font-sans">Not set</span>}
                        </div>
                    )}
                </div>

                {/* Location (Combined) */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Globe size={12}/> Country</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={formData.country} 
                                onChange={(e) => handleChange('country', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                            />
                        ) : (
                            <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent">
                                {formData.country || <span className="text-slate-500 italic">Not set</span>}
                            </div>
                        )}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={12}/> City</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={formData.city} 
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none text-sm transition-colors"
                            />
                        ) : (
                            <div className="text-white font-medium p-3 bg-slate-950/50 rounded-lg border border-transparent">
                                {formData.city || <span className="text-slate-500 italic">Not set</span>}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};
