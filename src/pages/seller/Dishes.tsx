import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Circle,
  Upload,
  X,
  Loader2
} from 'lucide-react';
import { DishService } from '../../services/dish.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { IDish, ICategory, User } from '../../types/api';
import toast from 'react-hot-toast';

const SellerDishes: React.FC = () => {
  const [dishes, setDishes] = useState<IDish[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<IDish | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dishToDelete, setDishToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isAvailable: true,
    hygieneInfo: '',
    preparationTime: '',
    ingredients: [] as string[],
    isFreeDelivery: false
  });
  const [ingredientInput, setIngredientInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [profileRes] = await Promise.all([
        UserService.getProfile()
      ]);
      
      setUser(profileRes.data);
      setCategories(profileRes.data.categories || []);
      
      if (profileRes.data.id) {
        const dishRes = await DishService.getDishes({ sellerId: profileRes.data.id });
        setDishes(dishRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dishes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dish?: IDish) => {
    if (dish) {
      setEditingDish(dish);
      setFormData({
        name: dish.name,
        description: dish.description,
        price: dish.price.toString(),
        categoryId: dish.categoryId,
        isAvailable: dish.isAvailable,
        hygieneInfo: dish.hygieneInfo || '',
        preparationTime: dish.preparationTime?.toString() || '',
        ingredients: dish.ingredients || [],
        isFreeDelivery: dish.isFreeDelivery || false
      });
      setPreviewUrls(dish.images || []);
    } else {
      setEditingDish(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        isAvailable: true,
        hygieneInfo: '',
        preparationTime: '',
        ingredients: [],
        isFreeDelivery: false
      });
      setPreviewUrls([]);
    }
    setIngredientInput('');
    setSelectedFiles([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const addIngredient = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();
    
    const trimmedInput = ingredientInput.trim();
    if (trimmedInput && !formData.ingredients.includes(trimmedInput)) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, trimmedInput]
      });
      setIngredientInput('');
    }
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index];
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // If it's a blob URL, we also need to remove the corresponding file from selectedFiles
    if (urlToRemove.startsWith('blob:')) {
      // Find which file this blob corresponds to. 
      // Since we add files and previews together, the order should match for new files.
      // However, it's safer to track the mapping. For now, assuming new files are at the end of previewUrls.
      // A better way is to filter selectedFiles if we know which one it is.
      // Let's rely on the fact that selectedFiles are those that aren't in the original dish.images
      setSelectedFiles(prev => prev.filter((_, i) => {
        // This is a bit tricky without a direct mapping. 
        // Let's simplify: if it's a blob, it must be from selectedFiles.
        // The index in selectedFiles would be "index - number of existing images".
        const existingImagesCount = editingDish?.images?.filter(url => previewUrls.includes(url)).length || 0;
        return i !== (index - existingImagesCount);
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      // Filter out blob URLs to get only existing remote images
      const existingImages = previewUrls.filter(url => !url.startsWith('blob:'));

      const dataPayload = {
        ...formData,
        price: Number(formData.price),
        preparationTime: formData.preparationTime ? Number(formData.preparationTime) : undefined,
        images: existingImages // Send the list of existing images to keep
      };

      const form = new FormData();
      form.append('data', JSON.stringify(dataPayload));
      
      selectedFiles.forEach(file => {
        form.append('images', file);
      });

      if (editingDish) {
        await DishService.updateDish(editingDish.id, form);
        toast.success('Dish updated successfully');
      } else {
        await DishService.createDish(form);
        toast.success('Dish created successfully');
      }

      setIsModalOpen(false);
      fetchInitialData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save dish');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!dishToDelete) return;
    try {
      setIsDeleting(true);
      await DishService.deleteDish(dishToDelete);
      toast.success('Dish deleted successfully');
      setDishes(prev => prev.filter(d => d.id !== dishToDelete));
      setDishToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete dish');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-brand" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">Your Dishes</h1>
          <p className="text-neutral-500 font-sans">Manage your menu, prices, and stock levels.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} className="mr-2" />
          Add New Dish
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input 
            placeholder="Search your dishes..." 
            className="pl-10"
            leftIcon={<Search size={18} className="text-neutral-400" />}
          />
        </div>
        <Button variant="secondary" className="bg-white border border-neutral-200">
          <Filter size={18} className="mr-2" />
          Filter
        </Button>
      </div>

      <Card className="overflow-hidden border-none bg-white p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Dish</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {dishes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    No dishes found. Start by adding your first dish!
                  </td>
                </tr>
              ) : (
                dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden shadow-sm">
                          {dish.images?.[0] ? (
                            <img src={dish.images[0]} alt={dish.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl text-neutral-400">
                              🍜
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-neutral-900 group-hover:text-brand transition-colors">{dish.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600 font-medium px-2.5 py-1 bg-neutral-100 rounded-md text-sm">
                        {dish.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">£{dish.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Circle 
                          size={8} 
                          fill="currentColor"
                          className={dish.isAvailable ? 'text-green-500' : 'text-red-500'} 
                        />
                        <span className="text-sm font-medium text-neutral-700">
                          {dish.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleOpenModal(dish)}>
                          <Edit3 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                          onClick={() => setDishToDelete(dish.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingDish ? 'Edit Dish' : 'Add New Dish'}
        maxW="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Dish Name</label>
            <Input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Spicy Tonkotsu Ramen"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Category</label>
              <select 
                required
                className="flex h-11 w-full bg-white px-3 py-2 text-sm border-2 border-neutral-100 text-neutral-900 rounded-xl outline-none transition-all focus:border-brand focus:border-2 appearance-none cursor-pointer"
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Price (£)</label>
              <Input 
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Description</label>
            <Textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your dish..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Hygiene Info (Optional)</label>
            <Input 
              value={formData.hygieneInfo}
              onChange={(e) => setFormData({...formData, hygieneInfo: e.target.value})}
              placeholder="e.g. Contains nuts, Gluten-free"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Prep Time (mins)</label>
              <Input 
                type="number"
                value={formData.preparationTime}
                onChange={(e) => setFormData({...formData, preparationTime: e.target.value})}
                placeholder="e.g. 20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Free Delivery</label>
              <div className="flex items-center h-10 gap-2">
                <input 
                  type="checkbox" 
                  id="isFreeDelivery"
                  checked={formData.isFreeDelivery}
                  onChange={(e) => setFormData({...formData, isFreeDelivery: e.target.checked})}
                  className="w-5 h-5 accent-brand cursor-pointer"
                />
                <label htmlFor="isFreeDelivery" className="text-sm text-neutral-600">Yes</label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-700">Ingredients</label>
            <div className="flex gap-2">
              <Input 
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={addIngredient}
                placeholder="Add ingredient and press Enter"
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addIngredient} className="h-11">
                Add
              </Button>
            </div>
            
            {formData.ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-100 min-h-[50px]">
                {formData.ingredients.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 shadow-sm"
                  >
                    {item}
                    <button 
                      type="button" 
                      onClick={() => removeIngredient(idx)}
                      className="p-0.5 hover:bg-red-50 hover:text-red-500 rounded transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Availability</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                className="w-5 h-5 accent-brand cursor-pointer"
              />
              <label htmlFor="isAvailable" className="text-sm text-neutral-600">Available for ordering</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Images</label>
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {previewUrls.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg cursor-pointer hover:border-brand transition-colors">
                  <Upload size={20} className="text-neutral-400" />
                  <span className="text-[10px] text-neutral-500 mt-1 uppercase font-bold tracking-wider">Upload</span>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1" 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button className="flex-1" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (editingDish ? 'Update Dish' : 'Create Dish')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={!!dishToDelete} 
        onClose={() => setDishToDelete(null)}
        title="Delete Dish"
      >
        <div className="space-y-4">
          <p className="text-neutral-600">Are you sure you want to delete this dish? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1" 
              onClick={() => setDishToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerDishes;
