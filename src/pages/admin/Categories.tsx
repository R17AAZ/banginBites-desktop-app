import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Plus, 
  Package, 
  Trash2, 
  Edit3,
  BarChart3,
  Loader2,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { CategoryService } from '../../services/category.service';
import { ICategory } from '../../types/api';
import { Modal } from '../../components/ui/Modal';
import { useDialog } from '../../context/DialogContext';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialog = useDialog();

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryService.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      toast.error('Could not load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setEditingCategory(null);
  };

  const handleOpenModal = (cat?: ICategory) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description || '');
      setImagePreview(cat.image || null);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingCategory) {
        await CategoryService.update(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        await CategoryService.create(formData);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await dialog.confirm({
      title: "Delete Category?",
      message: "Are you sure you want to remove this category? This action cannot be undone and may affect dishes currently assigned to it.",
      confirmText: "Delete Category",
      variant: "danger"
    });

    if (!confirmed) return;

    try {
      setLoading(true);
      await CategoryService.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-brand" size={48} />
        <p className="mt-4 text-neutral-500 font-medium font-sans">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-heading text-neutral-900 tracking-tighter">System Categories</h1>
          <p className="text-neutral-500 font-sans mt-1">Manage food categories and their visibility across the platform.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-brand/20">
          <Plus size={18} className="mr-2" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id} className="group hover:border-brand/30 border-neutral-100 shadow-sm transition-all flex flex-col">
            <CardHeader className="p-0 overflow-hidden relative aspect-video bg-neutral-100">
              {cat.image ? (
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                  <Package size={48} />
                </div>
              )}
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-black text-brand bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                <BarChart3 size={12} />
                ACTIVE
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <CardTitle className="mb-2 group-hover:text-brand transition-colors tracking-tight text-xl">{cat.name}</CardTitle>
              <CardDescription className="line-clamp-2 mb-4 leading-relaxed font-sans text-xs">
                {cat.description || 'No description provided.'}
              </CardDescription>
            </CardContent>
            <CardFooter className="gap-2 border-t border-neutral-50 p-4">
              <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs" onClick={() => handleOpenModal(cat)}>
                <Edit3 size={14} className="mr-1.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-9 text-xs text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(cat.id)}>
                <Trash2 size={14} className="mr-1.5" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add Card */}
        <button 
          onClick={() => handleOpenModal()}
          className="h-full min-h-[300px] border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center gap-3 text-neutral-400 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all group"
        >
          <div className="p-4 rounded-2xl bg-neutral-50 group-hover:bg-brand/10 transition-colors shadow-sm">
            <Plus size={24} />
          </div>
          <span className="font-black text-sm uppercase tracking-widest font-heading">Add Category</span>
        </button>
      </div>

      {/* Category Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        maxW="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Category Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Italian, Fast Food..." 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Tell us what this category is about..." 
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Thumbnail Image</label>
            <div 
              onClick={() => document.getElementById('category-image')?.click()}
              className="relative aspect-video rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-brand/40 hover:bg-neutral-50 transition-all group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-neutral-100 text-neutral-400 mb-2">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-xs font-bold text-neutral-500">Click to upload image</p>
                  <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
            <input 
              id="category-image" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-neutral-100">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin mr-2" size={16} /> Saving...</>
              ) : (
                editingCategory ? 'Update Category' : 'Create Category'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
