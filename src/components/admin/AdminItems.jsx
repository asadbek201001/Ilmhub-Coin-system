import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog.jsx';
import { Badge } from '../ui/badge.jsx';
import { Switch } from '../ui/switch.jsx';
import { Plus, Edit, Trash2, Search, Coins, Package, Eye } from 'lucide-react';

export function AdminItems({ items, setItems }) {
  const { t } = useLanguage();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemForm, setItemForm] = useState({
    name: '',
    price: '',
    description: '',
    available: true
  });

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now().toString(),
      name: itemForm.name,
      price: parseInt(itemForm.price),
      description: itemForm.description,
      available: itemForm.available,
      createdAt: new Date().toISOString(),
      purchaseCount: 0
    };

    setItems([...items, newItem]);
    setItemForm({ name: '', price: '', description: '', available: true });
    setShowAddDialog(false);
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleToggleAvailability = (itemId) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const availableItems = items.filter(item => item.available).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('items')}</h2>
          <p className="text-muted-foreground">Manage items in the store</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t('addItem')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('addItem')}</DialogTitle>
              <DialogDescription>Add a new item to the store</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">{t('itemName')}</Label>
                <Input
                  id="item-name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">{t('price')} ({t('coins')})</Label>
                <Input
                  id="item-price"
                  type="number"
                  min="1"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({...itemForm, price: e.target.value})}
                  placeholder="Enter price in coins"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-description">{t('description')}</Label>
                <Textarea
                  id="item-description"
                  value={itemForm.description}
                  onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                  placeholder="Enter item description"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="item-available"
                  checked={itemForm.available}
                  onCheckedChange={(checked) => setItemForm({...itemForm, available: checked})}
                />
                <Label htmlFor="item-available">{t('available')}</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Available Items</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableItems}</div>
            <p className="text-xs text-muted-foreground">Ready for purchase</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalValue}</div>
            <p className="text-xs text-muted-foreground">Coins in catalog</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {items.length > 0 ? Math.round(totalValue / items.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Coins per item</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Items ({filteredItems.length})</CardTitle>
          <CardDescription>List of all store items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('itemName')}</TableHead>
                <TableHead>{t('price')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No items found matching your search.' : 'No items found. Add an item to get started.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <Package className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Coins className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{item.price}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.available ? 'default' : 'secondary'}>
                          {item.available ? t('available') : 'Unavailable'}
                        </Badge>
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => handleToggleAvailability(item.id)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{item.purchaseCount || 0}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Item Categories (Future Feature) */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Items</CardTitle>
          <CardDescription>Most purchased items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredItems
              .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.name}</h4>
                    <Badge variant="outline">{item.purchaseCount || 0} sales</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Coins className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{item.price}</span>
                    </div>
                    <Badge variant={item.available ? 'default' : 'secondary'}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}