import React, { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Coins, ShoppingCart, Package, History, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';


export function StudentDashboard() {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchItems(), fetchTransactions()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/items`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setItems(data.items.filter((item) => item.available));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user?.studentId) return;
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/transactions/${user.studentId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const buyItem = async () => {
    if (!selectedItem) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!user || user.coinBalance < selectedItem.price) {
        setError(t('insufficientCoins'));
        setLoading(false);
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-3613a76e/buy-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId: selectedItem.id })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully purchased ${selectedItem.name}!`);
        setShowBuyDialog(false);
        setSelectedItem(null);
        await refreshUser();
        await fetchTransactions();
      } else {
        setError(data.error || 'Failed to purchase item');
      }
    } catch (error) {
      console.error('Error buying item:', error);
      setError('Failed to purchase item');
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  if (!user || user.role !== 'student') {
    return (
      <div className="p-8 text-center">
        <Alert variant="destructive">
          <AlertDescription>Access denied. Student privileges required.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcomeStudent')}, {user.name}
          </h1>
          <p className="text-gray-600">
            {t('studentId')}: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{user.studentId}</span>
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error}
              <Button variant="ghost" size="sm" className="ml-2" onClick={clearMessages}>
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>
              {success}
              <Button variant="ghost" size="sm" className="ml-2" onClick={clearMessages}>
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('coinBalance')}</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center space-x-2">
                <Coins className="h-6 w-6 text-blue-600" />
                <span>{user.coinBalance || 0}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('transactions')}</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('items')} Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{items.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store">{t('items')} Store</TabsTrigger>
            <TabsTrigger value="transactions">{t('transactions')}</TabsTrigger>
          </TabsList>

          {/* Store Tab */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>{t('items')} Store</CardTitle>
                <CardDescription>
                  Browse and purchase items with your coins
                </CardDescription>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No items available at the moment.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => {
                      const canAfford = (user.coinBalance || 0) >= item.price;
                      return (
                        <Card key={item.id} className={`hover:shadow-lg transition-shadow ${!canAfford ? 'opacity-60' : ''}`}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Coins className="h-3 w-3" />
                                <span>{item.price}</span>
                              </Badge>
                            </div>
                            <CardDescription>{item.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Dialog 
                              open={showBuyDialog && selectedItem?.id === item.id} 
                              onOpenChange={(open) => {
                                setShowBuyDialog(open);
                                if (!open) setSelectedItem(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  className="w-full"
                                  disabled={!canAfford}
                                  onClick={() => setSelectedItem(item)}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {canAfford ? t('buyItem') : t('insufficientCoins')}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Purchase</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to buy "{item.name}" for {item.price} coins?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-sm">Price:</span>
                                      <Badge className="flex items-center space-x-1">
                                        <Coins className="h-3 w-3" />
                                        <span>{item.price}</span>
                                      </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-sm">Your balance:</span>
                                      <span className="font-medium">{user.coinBalance} coins</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-sm">After purchase:</span>
                                      <span className="font-medium">{(user.coinBalance || 0) - item.price} coins</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setShowBuyDialog(false);
                                        setSelectedItem(null);
                                      }}
                                    >
                                      {t('cancel')}
                                    </Button>
                                    <Button onClick={buyItem} disabled={loading}>
                                      {loading ? t('loading') : t('buyItem')}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>{t('transactions')} History</CardTitle>
                <CardDescription>
                  View your coin transaction history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No transactions yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'received' ? 'default' : 'secondary'}>
                              {transaction.type === 'received' ? 'Received' : 'Purchase'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.type === 'received' 
                              ? transaction.reason || 'Coins awarded'
                              : transaction.itemName || 'Item purchase'
                            }
                          </TableCell>
                          <TableCell className="flex items-center space-x-1">
                            <Coins className={`h-4 w-4 ${transaction.type === 'received' ? 'text-green-600' : 'text-red-600'}`} />
                            <span className={transaction.type === 'received' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.type === 'received' ? '+' : ''}{transaction.amount}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}