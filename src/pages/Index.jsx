import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

const fetchHNStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['hnStories'],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">An error occurred: {error.message}</div>;

  return (
    <div className="min-h-screen p-8 bg-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Top 100 Hacker News Stories</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search stories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md mx-auto bg-blue-50 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-4">
        {isLoading ? (
          Array(10).fill().map((_, index) => (
            <div key={index} className="bg-blue-200 p-4 rounded shadow animate-pulse">
              <div className="h-4 bg-blue-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-blue-300 rounded w-1/4"></div>
            </div>
          ))
        ) : (
          filteredStories.map(story => (
            <div key={story.objectID} className="bg-blue-200 p-4 rounded shadow">
              <h2 className="text-xl font-semibold mb-2 text-blue-900">{story.title}</h2>
              <p className="text-blue-700 mb-2">Upvotes: {story.points}</p>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="bg-green-500 text-white hover:bg-green-600 border-green-600"
              >
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
