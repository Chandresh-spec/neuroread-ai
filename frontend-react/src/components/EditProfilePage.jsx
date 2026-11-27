import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  Check,
  Loader2,
  Camera,
  User,
  ImagePlus,
  Trash2,
  ArrowLeft,
  Shield,
  FileText,
  ChevronRight,
  Mail,
  Phone,
  Lock,
  Smartphone,
  Globe,
  Sparkles,
  BookOpen,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import UserAvatar from './UserAvatar';
import {
  DEFAULT_AVATARS,
  validateAvatarFile,
  validateDisplayName,
} from '../utils/profileHelpers';

export default function EditProfilePage({
  profile,
  onSaveProfile,
  onUploadAvatar,
  onRemoveAvatar,
  onBack,
}) {
  // Parse initial name into first & last name
  const parseNames = (fullName) => {
    const parts = (fullName || '').trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return { first: '', last: '' };
    if (parts.length === 1) return { first: parts[0], last: '' };
    return { first: parts[0], last: parts.slice(1).join(' ') };
  };

  const initialNames = parseNames(profile?.displayName);

  // Form State
  const [firstName, setFirstName] = useState(initialNames.first);
  const [lastName, setLastName] = useState(initialNames.last);
  const [gender, setGender] = useState(profile?.gender || 'not-specified');
  const [bio, setBio] = useState(
    profile?.bio || 'Passionate reader exploring neurodivergent reading tools and science.'
  );
  const [language, setLanguage] = useState(profile?.language || 'English (US)');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(profile?.phone || '+91 98765 43210');

  // Reading Preferences
  const [dyslexiaFont, setDyslexiaFont] = useState(profile?.dyslexiaFont ?? true);
  const [focusLine, setFocusLine] = useState(profile?.focusLine ?? false);
  const [readAloudSpeed, setReadAloudSpeed] = useState(profile?.readAloudSpeed || '1.0x');

  // Feedback states
  const [savedStatus, setSavedStatus] = useState('');
  const [nameError, setNameError] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('personal-info');

  // Photo modal state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoModalTab, setPhotoModalTab] = useState('upload'); // 'upload' | 'defaults'
  const [imageSrc, setImageSrc] = useState(null);
  const [imageNatural, setImageNatural] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDefault, setSelectedDefault] = useState(profile?.avatarUrl || '');

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fileInputRef = useRef(null);
  const imgElementRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, origX: 0, origY: 0 });

  // Sync display name if profile prop changes
  useEffect(() => {
    const parsed = parseNames(profile?.displayName);
    setFirstName(parsed.first);
    setLastName(parsed.last);
  }, [profile?.displayName]);

  // Clean blob URLs
  useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  // Combined full display name
  const currentFullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
  const isPersonalDirty =
    currentFullName !== (profile?.displayName || '') ||
    gender !== (profile?.gender || 'not-specified') ||
    bio !== (profile?.bio || 'Passionate reader exploring neurodivergent reading tools and science.') ||
    language !== (profile?.language || 'English (US)');

  const handleSavePersonalInfo = (e) => {
    e?.preventDefault();
    const err = validateDisplayName(currentFullName);
    if (err) {
      setNameError(err);
      return;
    }
    setNameError('');
    onSaveProfile({
      displayName: currentFullName,
      gender,
      bio,
      language,
    });
    setSavedStatus('Personal details updated successfully');
    setTimeout(() => setSavedStatus(''), 3000);
  };

  const handleSavePreferences = () => {
    onSaveProfile({
      dyslexiaFont,
      focusLine,
      readAloudSpeed,
    });
    setSavedStatus('Reading preferences updated');
    setTimeout(() => setSavedStatus(''), 3000);
  };

  const handleSavePhone = () => {
    setPhone(tempPhone);
    setIsEditingPhone(false);
    onSaveProfile({ phone: tempPhone });
    setSavedStatus('Mobile number updated');
    setTimeout(() => setSavedStatus(''), 3000);
  };

  // Avatar handlers
  const handleFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateAvatarFile(file);
    if (err) {
      setPhotoError(err);
      e.target.value = '';
      return;
    }
    setPhotoError('');
    if (imageSrc && imageSrc.startsWith('blob:')) URL.revokeObjectURL(imageSrc);
    setImageSrc(URL.createObjectURL(file));
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setPhotoModalTab('upload');
  };

  const handlePointerDown = (e) => {
    if (!imageSrc) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, origX: offset.x, origY: offset.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    const limit = 90 * zoom;
    setOffset({
      x: Math.max(-limit, Math.min(limit, dragStartRef.current.origX + dx)),
      y: Math.max(-limit, Math.min(limit, dragStartRef.current.origY + dy)),
    });
  };

  const renderCroppedDataUrl = () => {
    const imgEl = imgElementRef.current;
    if (!imgEl || !imageNatural.width || !imageNatural.height) return null;
    const outputSize = 320;
    const previewSize = 192;
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const baseScale = Math.max(previewSize / imageNatural.width, previewSize / imageNatural.height);
    const totalScale = baseScale * zoom;
    const drawnW = imageNatural.width * totalScale;
    const drawnH = imageNatural.height * totalScale;
    const ratio = outputSize / previewSize;
    const drawX = (previewSize - drawnW) / 2 + offset.x;
    const drawY = (previewSize - drawnH) / 2 + offset.y;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, outputSize, outputSize);
    ctx.drawImage(imgEl, drawX * ratio, drawY * ratio, drawnW * ratio, drawnH * ratio);
    return canvas.toDataURL('image/png', 0.92);
  };

  const handleConfirmUpload = async () => {
    const cropped = renderCroppedDataUrl();
    if (!cropped) {
      setPhotoError('Could not process that image. Please choose another file.');
      return;
    }
    setIsUploading(true);
    try {
      await onUploadAvatar(cropped);
      setIsPhotoModalOpen(false);
      setImageSrc(null);
      setSavedStatus('Profile photo updated');
      setTimeout(() => setSavedStatus(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDefaultAvatar = async () => {
    if (!selectedDefault) return;
    setIsUploading(true);
    try {
      await onUploadAvatar(selectedDefault);
      setIsPhotoModalOpen(false);
      setSavedStatus('Avatar updated');
      setTimeout(() => setSavedStatus(''), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordError('');
    setPasswordSuccess('Password changed successfully.');
    setTimeout(() => {
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess('');
    }, 1500);
  };

  const scrollToSection = (id) => {
    setActiveSectionId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navMenuItems = [
    { id: 'personal-info', label: 'Personal Information', icon: User },
    { id: 'contact-details', label: 'Contact & Account', icon: Mail },
    { id: 'reading-prefs', label: 'Reading Comfort', icon: BookOpen },
    { id: 'security-section', label: 'Login & Security', icon: Shield },
    { id: 'danger-zone', label: 'Account Control', icon: AlertTriangle },
  ];

  return (
    <div className="-mx-4 -my-6 sm:-mx-6 sm:-my-8 lg:-mx-10 xl:-mx-12 -mb-6 min-h-[calc(100vh-68px)] bg-[#F6F7FB] pb-16">
      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────────── */}
      {savedStatus && (
        <div className="fixed top-20 right-6 z-50 inline-flex items-center gap-2 bg-[#111827] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>{savedStatus}</span>
        </div>
      )}

      {/* ── MAIN CONTENT WRAPPER ───────────────────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14 pt-6 pb-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

          {/* ── LEFT SIDEBAR: PROFILE SUMMARY & JUMP MENU (Myntra/Flipkart style) ── */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4 lg:sticky lg:top-16">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-r from-[#4B3AE8] to-[#7B68EE] opacity-90" />
              
              {/* Back Button placed inside the card */}
              <button
                type="button"
                onClick={onBack}
                className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-[#111827] text-xs font-semibold shadow-xs transition-all active:scale-95"
                title="Back to previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#4B3AE8]" />
                <span>Back</span>
              </button>

              <div className="relative flex flex-col items-center text-center pt-4">
                {/* Avatar with Camera Overlay */}
                <div className="relative group mb-3">
                  <div className="ring-4 ring-white rounded-full shadow-md overflow-hidden bg-white">
                    <UserAvatar
                      name={currentFullName || profile?.displayName}
                      src={profile?.avatarUrl}
                      sizeClass="w-24 h-24"
                      textClass="text-2xl font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoError('');
                      setIsPhotoModalOpen(true);
                    }}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-[#1F2937] hover:bg-[#4B3AE8] text-white shadow-md transition-all transform hover:scale-110 focus:outline-none"
                    title="Change profile photo"
                    aria-label="Change profile photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-lg font-bold text-[#111827] leading-tight">
                  {currentFullName || 'Alex Morgan'}
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5 max-w-[200px] truncate">
                  {profile?.email}
                </p>

                {/* Plan Badge */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EEF2FF] text-[#4B3AE8] border border-[#C7D2FE]">
                    <Sparkles className="w-3 h-3" />
                    Free Reader
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563]">
                    Member since 2024
                  </span>
                </div>

                {/* Photo Actions */}
                <div className="mt-4 flex items-center gap-2 w-full pt-4 border-t border-[#F3F4F6]">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoError('');
                      setIsPhotoModalOpen(true);
                    }}
                    className="flex-1 text-xs font-semibold text-[#4B3AE8] hover:text-[#3826C7] bg-[#F5F3FF] hover:bg-[#EDE9FE] py-2 px-3 rounded-xl transition-colors"
                  >
                    Edit Photo
                  </button>
                  {profile?.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onRemoveAvatar();
                        setSavedStatus('Avatar removed');
                        setTimeout(() => setSavedStatus(''), 2500);
                      }}
                      className="text-xs font-medium text-[#EF4444] hover:text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] py-2 px-3 rounded-xl transition-colors"
                      title="Remove custom photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Navigation Card (Desktop only, scroll anchor) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#E5E7EB] p-2 shadow-xs">
              <div className="px-4 py-2.5">
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  Profile Menu
                </p>
              </div>
              <nav className="space-y-0.5">
                {navMenuItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      activeSectionId === id
                        ? 'bg-[#EEF2FF] text-[#4B3AE8]'
                        : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${activeSectionId === id ? 'text-[#4B3AE8]' : 'text-[#9CA3AF]'}`} />
                      <span>{label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ── RIGHT MAIN PANEL: SINGLE PAGE EDITABLE SECTIONS ────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* ── SECTION 1: PERSONAL INFORMATION (Flipkart / Myntra style) ── */}
            <section
              id="personal-info"
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4.5 border-b border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#4B3AE8]">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Personal Information</h3>
                    <p className="text-xs text-[#6B7280]">Your public reader identity</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onBack}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] text-xs font-semibold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              </div>

              <form onSubmit={handleSavePersonalInfo} className="p-6 space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5"
                    >
                      First Name
                    </label>
                    <input
                      id="first-name"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full h-11 px-3.5 text-sm text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5"
                    >
                      Last Name
                    </label>
                    <input
                      id="last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Morgan"
                      className="w-full h-11 px-3.5 text-sm text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 transition-all"
                    />
                  </div>
                </div>

                {nameError && (
                  <p className="text-xs text-[#EF4444] flex items-center gap-1.5 -mt-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {nameError}
                  </p>
                )}

                {/* Your Gender Selection (Flipkart style chips) */}
                <div>
                  <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-2">
                    Your Gender
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { id: 'male', label: 'Male' },
                      { id: 'female', label: 'Female' },
                      { id: 'non-binary', label: 'Non-binary' },
                      { id: 'not-specified', label: 'Prefer not to say' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setGender(item.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          gender === item.id
                            ? 'bg-[#EEF2FF] text-[#4B3AE8] border-[#A5B4FC] shadow-xs'
                            : 'bg-[#F9FAFB] text-[#4B5563] border-[#E5E7EB] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bio / Tagline */}
                <div>
                  <label
                    htmlFor="bio-input"
                    className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5"
                  >
                    About / Reading Bio
                  </label>
                  <textarea
                    id="bio-input"
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about your reading interests..."
                    className="w-full p-3 text-sm text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 transition-all resize-none"
                  />
                  <p className="text-[11px] text-[#9CA3AF] mt-1">
                    Visible on community book discussions and reviews.
                  </p>
                </div>

                {/* Preferred Reading Language */}
                <div>
                  <label
                    htmlFor="preferred-language"
                    className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1.5"
                  >
                    Preferred Language
                  </label>
                  <div className="relative">
                    <select
                      id="preferred-language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full h-11 px-3.5 pr-8 text-sm text-[#111827] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:bg-white focus:outline-none focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 transition-all appearance-none cursor-pointer"
                    >
                      <option value="English (US)">English (US)</option>
                      <option value="English (UK)">English (UK)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Spanish">Spanish (Español)</option>
                      <option value="French">French (Français)</option>
                      <option value="German">German (Deutsch)</option>
                    </select>
                    <Globe className="w-4 h-4 text-[#9CA3AF] absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Save Button for Personal Info */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#F3F4F6]">
                  <button
                    type="submit"
                    disabled={!isPersonalDirty}
                    className="px-6 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-95"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* ── SECTION 2: CONTACT & ACCOUNT (Flipkart / Amazon style) ────── */}
            <section
              id="contact-details"
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4.5 border-b border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#16A34A]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Contact & Login Info</h3>
                    <p className="text-xs text-[#6B7280]">Primary credentials used for login & notifications</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Email Address */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Email Address
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#111827]">{profile?.email}</p>
                    <p className="text-xs text-[#9CA3AF]">
                      Used for logging in, synchronization, and receipt delivery.
                    </p>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                        Mobile Number
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    {isEditingPhone ? (
                      <div className="flex items-center gap-2 pt-1 max-w-sm">
                        <input
                          type="tel"
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value)}
                          className="h-9 px-3 text-sm text-[#111827] bg-white border border-[#D1D5DB] rounded-lg focus:border-[#4B3AE8] focus:outline-none focus:ring-1 focus:ring-[#4B3AE8]"
                        />
                        <button
                          type="button"
                          onClick={handleSavePhone}
                          className="h-9 px-3 text-xs font-semibold bg-[#4B3AE8] text-white rounded-lg hover:bg-[#3E2ED6]"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTempPhone(phone);
                            setIsEditingPhone(false);
                          }}
                          className="h-9 px-3 text-xs font-medium text-[#6B7280] hover:text-[#111827]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-[#111827]">{phone}</p>
                    )}
                    <p className="text-xs text-[#9CA3AF]">
                      Required for instant OTP logins and password recovery.
                    </p>
                  </div>
                  {!isEditingPhone && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="text-xs font-semibold text-[#4B3AE8] hover:text-[#3826C7] sm:self-center"
                    >
                      Edit Number
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* ── SECTION 3: READING COMFORT & ACCESSIBILITY PREFERENCES ─────── */}
            <section
              id="reading-prefs"
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4.5 border-b border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] flex items-center justify-center text-[#9333EA]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Reading Comfort & Accessibility</h3>
                    <p className="text-xs text-[#6B7280]">Default preferences for book reader view</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Dyslexia Friendly Font */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Dyslexia-Friendly Typography</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Uses OpenDyslexic weighted font on books and reader pages by default.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={dyslexiaFont}
                    onClick={() => {
                      setDyslexiaFont(!dyslexiaFont);
                      onSaveProfile({ dyslexiaFont: !dyslexiaFont });
                      setSavedStatus('Dyslexia font preference updated');
                      setTimeout(() => setSavedStatus(''), 2500);
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      dyslexiaFont ? 'bg-[#4B3AE8]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        dyslexiaFont ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Focus Line */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Reading Focus Guide / Ruler</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Highlights active sentence or line to reduce visual wandering.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={focusLine}
                    onClick={() => {
                      setFocusLine(!focusLine);
                      onSaveProfile({ focusLine: !focusLine });
                      setSavedStatus('Focus line preference updated');
                      setTimeout(() => setSavedStatus(''), 2500);
                    }}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      focusLine ? 'bg-[#4B3AE8]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        focusLine ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Read Aloud Speed */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB]">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Audio Narration Speed</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Default playback rate when reading books aloud.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {['0.8x', '1.0x', '1.2x', '1.5x'].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => {
                          setReadAloudSpeed(spd);
                          onSaveProfile({ readAloudSpeed: spd });
                          setSavedStatus(`Narration speed set to ${spd}`);
                          setTimeout(() => setSavedStatus(''), 2500);
                        }}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                          readAloudSpeed === spd
                            ? 'bg-[#4B3AE8] text-white border-[#4B3AE8]'
                            : 'bg-white text-[#4B5563] border-[#D1D5DB] hover:bg-[#F3F4F6]'
                        }`}
                      >
                        {spd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── SECTION 4: SECURITY & LOGIN (Amazon / Flipkart security) ──── */}
            <section
              id="security-section"
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4.5 border-b border-[#F3F4F6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111827]">Login & Security</h3>
                    <p className="text-xs text-[#6B7280]">Credentials and connected devices</p>
                  </div>
                </div>
              </div>

              <div className="p-6 divide-y divide-[#F3F4F6]">
                {/* Password Item */}
                <div className="pb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Password</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">Last changed 2 months ago</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError('');
                      setPasswordSuccess('');
                      setIsPasswordModalOpen(true);
                    }}
                    className="px-4 py-1.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                  >
                    Change Password
                  </button>
                </div>

                {/* 2-Step Verification */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#111827]">Two-Factor Authentication (2FA)</p>
                      <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Verification code required via email or authenticator app.
                    </p>
                  </div>
                  <span className="text-xs text-[#9CA3AF] font-medium">Configured</span>
                </div>

                {/* Active Session info */}
                <div className="pt-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 text-[#9CA3AF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">Active Devices</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Current Session: Web Chrome on Windows · Mumbai, IN
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedStatus('Logged out of other sessions');
                      setTimeout(() => setSavedStatus(''), 2500);
                    }}
                    className="text-xs font-semibold text-[#4B3AE8] hover:text-[#3826C7] whitespace-nowrap"
                  >
                    Log out others
                  </button>
                </div>
              </div>
            </section>

            {/* ── SECTION 5: ACCOUNT CONTROL & DANGER ZONE ────────────────── */}
            <section
              id="danger-zone"
              className="bg-white rounded-2xl border border-[#FEE2E2] shadow-xs overflow-hidden scroll-mt-20"
            >
              <div className="px-6 py-4.5 bg-[#FEF2F2]/40 border-b border-[#FEE2E2] flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                <h3 className="text-sm font-bold text-[#991B1B]">Account Control & Data</h3>
              </div>

              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Deactivate or Delete Account</p>
                  <p className="text-xs text-[#6B7280] mt-0.5 max-w-lg">
                    Once deleted, your highlights, reading history, and uploaded PDF files will be permanently erased.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FECACA] transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  Delete Account
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* ── HIDDEN FILE INPUT ──────────────────────────────────────────────── */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="sr-only"
      />

      {/* ── PHOTO CROP & AVATAR PICKER MODAL (Professional Dialog) ────────── */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E5E7EB] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827]">Update Profile Photo</h3>
              <button
                type="button"
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setImageSrc(null);
                }}
                className="p-1 rounded-full text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#F3F4F6] bg-[#F9FAFB] px-6 pt-2">
              <button
                type="button"
                onClick={() => setPhotoModalTab('upload')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all ${
                  photoModalTab === 'upload'
                    ? 'border-[#4B3AE8] text-[#4B3AE8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Upload & Crop
              </button>
              <button
                type="button"
                onClick={() => setPhotoModalTab('defaults')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 text-center transition-all ${
                  photoModalTab === 'defaults'
                    ? 'border-[#4B3AE8] text-[#4B3AE8]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Choose Preset
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {photoModalTab === 'upload' && (
                <div className="space-y-4">
                  {imageSrc ? (
                    <div>
                      <p className="text-xs text-[#6B7280] mb-3 text-center">
                        Drag to reposition, use slider to zoom.
                      </p>
                      <div className="flex justify-center mb-4">
                        <div
                          onPointerDown={handlePointerDown}
                          onPointerMove={handlePointerMove}
                          onPointerUp={() => setIsDragging(false)}
                          onPointerCancel={() => setIsDragging(false)}
                          className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-[#4B3AE8] shadow-inner bg-[#F3F4F6] cursor-grab active:cursor-grabbing touch-none select-none flex-shrink-0"
                        >
                          <img
                            ref={imgElementRef}
                            src={imageSrc}
                            alt="Crop preview"
                            onLoad={(e) =>
                              setImageNatural({
                                width: e.currentTarget.naturalWidth,
                                height: e.currentTarget.naturalHeight,
                              })
                            }
                            draggable={false}
                            style={{
                              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                            }}
                            className="w-full h-full object-cover pointer-events-none select-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex justify-between text-xs text-[#6B7280]">
                          <span>Zoom</span>
                          <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full accent-[#4B3AE8]"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
                        >
                          Choose Other
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmUpload}
                          disabled={isUploading}
                          className="flex-1 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Photo'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#EEF2FF] text-[#4B3AE8] flex items-center justify-center mb-3">
                        <ImagePlus className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-[#111827]">Upload custom image</h4>
                      <p className="text-xs text-[#6B7280] mt-1 max-w-xs mx-auto">
                        Supports JPG, PNG, or WebP up to 5 MB.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 px-6 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-all active:scale-95"
                      >
                        <Camera className="w-4 h-4" />
                        Select File
                      </button>
                    </div>
                  )}

                  {photoError && (
                    <p className="text-xs text-[#EF4444] flex items-center gap-1.5 justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {photoError}
                    </p>
                  )}
                </div>
              )}

              {photoModalTab === 'defaults' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#6B7280]">
                    Select an illustrated avatar designed for NeuroReader:
                  </p>
                  <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                    {DEFAULT_AVATARS.map((item) => {
                      const isSelected = selectedDefault === item.dataUrl;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedDefault(item.dataUrl)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-[#4B3AE8] bg-[#EEF2FF] ring-2 ring-[#4B3AE8]/20'
                              : 'border-[#E5E7EB] hover:border-[#CBD5E1] bg-[#F9FAFB]'
                          }`}
                        >
                          <img src={item.dataUrl} alt="" className="w-10 h-10 rounded-full" />
                          <span className="text-[10px] text-[#4B5563] truncate w-full text-center">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDefaultAvatar}
                      disabled={isUploading || !selectedDefault}
                      className="flex-1 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set Avatar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CHANGE PASSWORD MODAL ──────────────────────────────────────────── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#E5E7EB] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#111827]">Change Password</h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-full text-[#9CA3AF] hover:text-[#111827]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 text-sm border border-[#D1D5DB] rounded-xl focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full h-10 px-3 text-sm border border-[#D1D5DB] rounded-xl focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4B5563] uppercase tracking-wider mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-10 px-3 text-sm border border-[#D1D5DB] rounded-xl focus:border-[#4B3AE8] focus:ring-2 focus:ring-[#4B3AE8]/15 focus:outline-none"
                />
              </div>

              {passwordError && (
                <p className="text-xs text-[#EF4444] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="text-xs text-[#10B981] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {passwordSuccess}
                </p>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#4B3AE8] hover:bg-[#3E2ED6] text-white text-xs font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE ACCOUNT CONFIRMATION MODAL ─────────────────────────────── */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#FEE2E2] overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-[#111827]">Delete your NeuroReader account?</h3>
              <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                This action is permanent and cannot be undone. All your bookmarks, reading progress, and uploaded PDF documents will be removed.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold text-[#374151] hover:bg-[#F9FAFB]"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSavedStatus('Account deletion request submitted');
                  setTimeout(() => setSavedStatus(''), 4000);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
