# REST API Spec

```yaml
openapi: 3.0.0
info:
  title: ChatStoryAI API
  version: 1.0.0
  description: API for ChatStoryAI story creation platform with AI integration
servers:
  - url: http://localhost:3000/api
    description: Development server
  - url: https://chatstoryai.com/api
    description: Production server

paths:
  /stories:
    get:
      summary: Get user stories
      tags: [Stories]
      security:
        - sessionAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, archived]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        200:
          description: List of stories
          content:
            application/json:
              schema:
                type: object
                properties:
                  stories:
                    type: array
                    items:
                      $ref: "#/components/schemas/Story"
                  pagination:
                    $ref: "#/components/schemas/Pagination"

    post:
      summary: Create new story
      tags: [Stories]
      security:
        - sessionAuth: []
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                title:
                  type: string
                description:
                  type: string
                mainCategoryId:
                  type: integer
                tagIds:
                  type: array
                  items:
                    type: integer
      responses:
        201:
          description: Story created successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Story"

  /stories/{id}:
    get:
      summary: Get story by ID
      tags: [Stories]
      security:
        - sessionAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: Story details
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/StoryDetail"

    put:
      summary: Update story
      tags: [Stories]
      security:
        - sessionAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/StoryUpdate"
      responses:
        200:
          description: Story updated successfully

  /ai/chat:
    post:
      summary: Chat with AI assistant
      tags: [AI]
      security:
        - sessionAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                chatId:
                  type: integer
                storyId:
                  type: integer
                images:
                  type: array
                  items:
                    type: string
      responses:
        200:
          description: AI response
          content:
            application/json:
              schema:
                type: object
                properties:
                  response:
                    type: string
                  chatId:
                    type: integer

components:
  schemas:
    Story:
      type: object
      properties:
        story_id:
          type: integer
        title:
          type: string
        description:
          type: string
        main_category:
          type: string
        status:
          type: string
          enum: [draft, published, archived]
        cover_image:
          type: string
        view_count:
          type: integer
        favorite_count:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    StoryDetail:
      allOf:
        - $ref: "#/components/schemas/Story"
        - type: object
          properties:
            chapters:
              type: array
              items:
                $ref: "#/components/schemas/Chapter"
            characters:
              type: array
              items:
                $ref: "#/components/schemas/Character"
            tags:
              type: array
              items:
                type: string

    Chapter:
      type: object
      properties:
        chapter_id:
          type: integer
        title:
          type: string
        summary:
          type: string
        status:
          type: string
        order_number:
          type: integer

    Character:
      type: object
      properties:
        character_id:
          type: integer
        name:
          type: string
        description:
          type: string
        gender:
          type: string
        personality:
          type: string
        appearance:
          type: string
        role:
          type: string

    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer

  securitySchemes:
    sessionAuth:
      type: apiKey
      in: cookie
      name: next-auth.session-token
```
