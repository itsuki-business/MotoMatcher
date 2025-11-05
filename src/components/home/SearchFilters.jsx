import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { prefectures, photographyGenres } from '@/config/environment';

export function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    prefecture: '',
    genre: '',
    keyword: '',
    maxRate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      prefecture: '',
      genre: '',
      keyword: '',
      maxRate: ''
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="フォトグラファーを検索..."
            className="pl-10"
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          フィルター
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>都道府県</Label>
                <Select
                  value={filters.prefecture}
                  onValueChange={(value) => handleFilterChange('prefecture', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {prefectures.map((pref) => (
                      <SelectItem key={pref} value={pref}>
                        {pref}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>撮影ジャンル</Label>
                <Select
                  value={filters.genre}
                  onValueChange={(value) => handleFilterChange('genre', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {photographyGenres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>最低料金（上限）</Label>
                <Select
                  value={filters.maxRate}
                  onValueChange={(value) => handleFilterChange('maxRate', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">上限なし</SelectItem>
                    <SelectItem value="5000">5,000円以下</SelectItem>
                    <SelectItem value="10000">10,000円以下</SelectItem>
                    <SelectItem value="15000">15,000円以下</SelectItem>
                    <SelectItem value="20000">20,000円以下</SelectItem>
                    <SelectItem value="30000">30,000円以下</SelectItem>
                    <SelectItem value="50000">50,000円以下</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="ghost" onClick={handleClearFilters}>
                フィルターをクリア
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

