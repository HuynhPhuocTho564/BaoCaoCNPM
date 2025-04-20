interface Quote {
  id: number;
  author: string;
  text: string;
  initial: string;
  bgColor: string;
}

export const quotes: Quote[] = [
  {
    id: 1,
    author: "Albert Einstein",
    text: "Trí tưởng tượng quan trọng hơn kiến thức. Kiến thức có giới hạn, trí tưởng tượng bao trùm cả thế giới.",
    initial: "AE",
    bgColor: "bg-blue-600"
  },
  {
    id: 2,
    author: "Marie Curie",
    text: "Trong cuộc đời, không có gì đáng sợ, chỉ có điều cần phải hiểu.",
    initial: "MC",
    bgColor: "bg-purple-600"
  },
  {
    id: 3,
    author: "Steve Jobs",
    text: "Thời gian của bạn có hạn, đừng lãng phí nó để sống cuộc đời của người khác.",
    initial: "SJ",
    bgColor: "bg-gray-700"
  },
  {
    id: 4,
    author: "Nelson Mandela",
    text: "Giáo dục là vũ khí mạnh nhất mà bạn có thể sử dụng để thay đổi thế giới.",
    initial: "NM",
    bgColor: "bg-green-600"
  },
  // Thêm nhiều câu nói khác ở đây
]

export function getRandomQuotes(count: number = 3): Quote[] {
  const shuffled = [...quotes].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 