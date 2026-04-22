import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Camera, Save, Phone, MapPin, Edit2, Check } from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { UserService } from '../../services/user.service';
import { User, ICategory } from '../../types/api';
import { PublicService } from '../../services/public.service';
import toast from 'react-hot-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  useEffect(() => {
    fetchProfile();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await PublicService.getCategories();
      if (res.success) {
        setAllCategories(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await UserService.getProfile();
      if (res.success && res.data) {
        setUser(res.data);
        setFormData({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          street: res.data.address?.street || '',
          city: res.data.address?.city || '',
          state: res.data.address?.state || '',
          zipCode: res.data.address?.zipCode || '',
        });
        if (res.data.profile) {
          setProfileImage(res.data.profile);
        }
        if (res.data.categories) {
          setSelectedCategoryIds(res.data.categories.map((c: ICategory) => c.id));
        }
      }
    } catch (error: any) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      
      // Package profile data into the 'data' field as a JSON string
      // This is expected by the backend for complex/nested objects
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: user?.address?.country || 'UK'
        },
        categoryIds: selectedCategoryIds
      };
      
      data.append('data', JSON.stringify(updateData));

      if (imageFile) {
        data.append('profile', imageFile);
      }

      const res = await UserService.updateProfile(data);
      if (res.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium animate-pulse">Fetching your details...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=" mx-auto px-4 py-8 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">Profile Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your public profile and account details</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-xl font-medium"
            onClick={() => setIsEditing(!isEditing)}
            disabled={saving}
          >
            {isEditing ? <Check size={18} className="mr-2" /> : <Edit2 size={18} className="mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
          {isEditing && (
            <Button 
              className="flex items-center gap-2 rounded-xl font-medium bg-brand hover:bg-brand/90"
              onClick={handleSave}
              isLoading={saving}
            >
              <Save size={18} />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 text-center">
              <div className="relative group inline-block">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand/20 to-brand/10 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={48} className="text-brand/60" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-brand text-white rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Camera size={14} />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              <h3 className="mt-4 text-xl font-bold font-heading text-neutral-900">{user?.name || 'New User'}</h3>
              <p className="text-sm text-neutral-500 mt-1">Role: <span className="capitalize">{user?.role?.toLowerCase()}</span></p>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>{user?.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h2 className="text-lg font-bold font-heading text-neutral-900">Personal Information</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Update your personal details</p>
            </div>

            <div className="p-6 space-y-5">
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? "bg-neutral-50" : "bg-white"}
              />

              <Input
                label="Email Address"
                value={formData.email}
                leftIcon={<Mail size={16} />}
                disabled={true} // Email is usually non-editable
                className="bg-neutral-50"
              />

              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone size={16} />}
                disabled={!isEditing}
                className={!isEditing ? "bg-neutral-50" : "bg-white"}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h2 className="text-lg font-bold font-heading text-neutral-900">{user?.role === 'ADMIN' ? 'Address' : 'Delivery Address'}</h2>
              <p className="text-xs text-neutral-500 mt-0.5">{user?.role === 'ADMIN' ? 'Primary operating address' : 'Your primary delivery location'}</p>
            </div>

            <div className="p-6 space-y-5">
              <Input
                label="Street Address"
                placeholder="123 Main St"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                leftIcon={<MapPin size={16} />}
                disabled={!isEditing}
                className={!isEditing ? "bg-neutral-50" : "bg-white"}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-neutral-50" : "bg-white"}
                />
                <Input
                  label="Line Address"
                  placeholder="Line Address"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-neutral-50" : "bg-white"}
                />
                <Input
                  label="Zip Code"
                  placeholder="12345"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-neutral-50" : "bg-white"}
                />
              </div>
            </div>
          </div>

          {/* Specializations Section (For Sellers) */}
          {user?.role === 'SELLER' && (
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-lg font-bold font-heading text-neutral-900">Food Specializations</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Select the types of food your kitchen specializes in</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allCategories.map((category) => (
                    <label 
                      key={category.id} 
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedCategoryIds.includes(category.id) 
                          ? 'border-brand bg-brand/5' 
                          : 'border-neutral-100 hover:border-neutral-200'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={selectedCategoryIds.includes(category.id)}
                        disabled={!isEditing}
                        onChange={() => {
                          if (selectedCategoryIds.includes(category.id)) {
                            setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== category.id));
                          } else {
                            setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                          }
                        }}
                        className="w-4 h-4 rounded text-brand focus:ring-brand accent-brand"
                      />
                      <span className="text-sm font-medium text-neutral-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;