/* eslint-disable */
// @ts-nocheck
"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

interface ApiParameter {
  name: string;
  schema?: { type: string };
  type?: string;
  required: boolean;
  description: string;
}

interface ApiResponse {
  description: string;
  content?: Record<string, unknown>;
}

interface ApiRequestBody {
  description?: string;
  content?: Record<string, unknown>;
  required?: boolean;
}

interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters?: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: Record<string, ApiResponse>;
}

interface ApiInfo {
  title: string;
  description: string;
  version: string;
}

interface ApiSpec {
  openapi: string;
  info: ApiInfo;
  servers: Array<{ url: string; description?: string }>;
  paths: Record<string, Record<string, ApiEndpoint>>;
  components: Record<string, unknown>;
}

export default function DocsPage() {
  const [spec, setSpec] = useState<ApiSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const typingRef = useRef<HTMLDivElement>(null);
  const loadingContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const response = await fetch("/api/docs");
        if (!response.ok) {
          throw new Error("Không thể tải API specification");
        }
        const data = await response.json();
        setSpec(data);

        // Fade out loading với animation
        if (loadingContainerRef.current) {
          gsap.to(loadingContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setLoading(false);
            },
          });
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
        if (loadingContainerRef.current) {
          gsap.to(loadingContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              setLoading(false);
            },
          });
        } else {
          setLoading(false);
        }
      }
    };

    fetchSpec();
  }, []);

  // Loading animation effect
  useEffect(() => {
    if (loading) {
      // Animation cho các tin nhắn
      messageRefs.current.forEach(
        (msg: HTMLDivElement | null, index: number) => {
          if (msg) {
            gsap.fromTo(
              msg,
              {
                x: index % 2 === 0 ? -50 : 50,
                opacity: 0,
              },
              {
                x: 0,
                opacity: 1,
                duration: 0.5,
                delay: index * 0.3,
                ease: "power2.out",
              }
            );
          }
        }
      );

      // Animation cho typing indicator
      const dots = typingRef.current?.querySelectorAll(".typing-dot");
      dots?.forEach((dot: Element, index: number) => {
        gsap.to(dot, {
          scale: 1.2,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.2,
          repeat: -1,
          repeatDelay: 0.5,
          yoyo: true,
          ease: "power2.inOut",
        });
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">
              ChatStoryAI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              đang tải API documentation...
            </p>
          </div>

          {/* Loading messages */}
          <div
            ref={(el: HTMLDivElement | null) => {
              messageRefs.current[0] = el;
            }}
            className="flex items-start gap-2 opacity-0"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              API
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none max-w-xs">
              <p className="text-sm text-gray-900 dark:text-gray-200">
                Đang khởi tạo Swagger documentation...
              </p>
            </div>
          </div>

          <div
            ref={(el: HTMLDivElement | null) => {
              messageRefs.current[1] = el;
            }}
            className="flex items-start gap-2 opacity-0"
          >
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
              DB
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none max-w-xs">
              <p className="text-sm text-gray-900 dark:text-gray-200">
                Đang tải schemas và endpoints...
              </p>
            </div>
          </div>

          <div
            ref={(el: HTMLDivElement | null) => {
              messageRefs.current[2] = el;
            }}
            className="flex items-start justify-end gap-2 opacity-0"
          >
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-xs">
              <p className="text-sm">Sẵn sàng khám phá APIs! 🚀</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-medium">
              SW
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none">
              <div ref={typingRef} className="flex gap-2">
                <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 opacity-50 scale-75" />
                <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 opacity-50 scale-75" />
                <div className="typing-dot w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 opacity-50 scale-75" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="w-full max-w-md space-y-4 p-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">
              ChatStoryAI
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              có lỗi xảy ra khi tải documentation
            </p>
          </div>

          {/* Error message */}
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-medium">
              ❌
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-2xl rounded-tl-none max-w-xs">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>

          {/* Retry button */}
          <div className="flex items-start justify-end gap-2">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none max-w-xs">
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                🔄 Thử lại
              </Button>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spec) return null;

  // Lấy tất cả endpoints
  const endpoints: (ApiEndpoint & { path: string; method: string })[] = [];
  Object.entries(spec.paths).forEach(([path, methods]) => {
    Object.entries(methods as Record<string, ApiEndpoint>).forEach(
      ([method, endpoint]) => {
        endpoints.push({ ...endpoint, path, method: method.toUpperCase() });
      }
    );
  });

  // Lấy tất cả tags
  const allTags = Array.from(new Set(endpoints.flatMap((e) => e.tags || [])));

  // Filter endpoints theo tag
  const filteredEndpoints =
    selectedTag === "all"
      ? endpoints
      : endpoints.filter((e) => e.tags?.includes(selectedTag));

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500 text-white";
      case "POST":
        return "bg-blue-500 text-white";
      case "PUT":
        return "bg-yellow-500 text-white";
      case "DELETE":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {spec.info.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {spec.info.description}
              </p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Version: {spec.info.version} | OpenAPI: {spec.openapi}
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open("/", "_self")}
              >
                ← Về trang chủ
              </Button>
              <Button onClick={() => window.open("/api/docs", "_blank")}>
                Tải JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tags */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Lọc theo nhóm API
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === "all" ? "default" : "outline"}
              onClick={() => setSelectedTag("all")}
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Tất cả ({endpoints.length})
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                onClick={() => setSelectedTag(tag)}
                size="sm"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {tag} ({endpoints.filter((e) => e.tags?.includes(tag)).length})
              </Button>
            ))}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="space-y-6">
          {filteredEndpoints.map((endpoint, index) => (
            <div
              key={`${endpoint.path}-${endpoint.method}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium ${getMethodColor(
                      endpoint.method
                    )}`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded">
                    {endpoint.path}
                  </code>
                  {endpoint.tags && (
                    <div className="flex gap-2">
                      {endpoint.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {endpoint.summary}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {endpoint.description}
                </p>

                {/* Parameters */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Parameters:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 dark:border-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                              Type
                            </th>
                            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                              Required
                            </th>
                            <th className="px-4 py-2 text-left text-gray-900 dark:text-white">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.parameters.map(
                            (param: ApiParameter, i: number) => (
                              <tr
                                key={i}
                                className="border-t border-gray-200 dark:border-gray-600"
                              >
                                <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-200">
                                  {param.name}
                                </td>
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                                  {param.schema?.type || param.type}
                                </td>
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                                  {param.required ? "Yes" : "No"}
                                </td>
                                <td className="px-4 py-2 text-gray-900 dark:text-gray-200">
                                  {param.description}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Request Body:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                      <pre className="text-sm overflow-x-auto text-gray-900 dark:text-gray-200">
                        {JSON.stringify(endpoint.requestBody, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                    Responses:
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(endpoint.responses).map(
                      ([status, response]: [string, ApiResponse]) => (
                        <div
                          key={status}
                          className="border dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded text-sm font-medium ${
                                status.startsWith("2")
                                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                  : status.startsWith("4")
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : "bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {status}
                            </span>
                            <span className="text-gray-600 dark:text-gray-300">
                              {response.description}
                            </span>
                          </div>
                          {response.content && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Content-Type:{" "}
                              {Object.keys(response.content).join(", ")}
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEndpoints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Không có API endpoints nào cho nhóm này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
