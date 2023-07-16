#!/usr/bin/env python
# coding: utf-8

# In[1]:


pip install pygame


# In[2]:


import pygame
import random

# Initialize Pygame
pygame.init()

# Set up the game window
width, height = 1280, 960
window = pygame.display.set_mode((width, height))
pygame.display.set_caption("PSYCHOSE")

# Define colors
BLACK = pygame.Color(0, 0, 0)
GREEN = pygame.Color(0, 255, 0)
RED = pygame.Color(255, 0, 0)
YELLOW = pygame.Color(255, 255, 0)
WHITE = pygame.Color(255, 255, 255)
TRANSPARENT = pygame.Color(0, 0, 0, 0)  # Fully transparent color

# Define the snake and food sizes
block_size = 80
block_size2 = 1000

# Define the snake movement speed
snake_speed = 10

# Define the font sizes
font_size = 100
score_font_size = 30

# Load Psychose logo image
logo_img = pygame.image.load("psychose_logo2.png")
logo_img = pygame.transform.scale(logo_img, (block_size, block_size))

logo_img2 = pygame.image.load("psychose_logo.png")
logo_img2 = pygame.transform.scale(logo_img2, (block_size2, block_size2))

# Load background music
pygame.mixer.music.load("background_music.mp3")
pygame.mixer.music.play(-1)  # Play the music in an infinite loop

# Load food sound effect
food_sound = pygame.mixer.Sound("food_sound.mp3")

# Load game over sound effect
game_over_sound = pygame.mixer.Sound("game_over_sound.mp3")

# Load custom background images
main_game_bg = pygame.image.load("main_game_bg.png")
game_over_bg = pygame.image.load("game_over_bg.png")

def show_image(image, duration):
    image_rect = image.get_rect(center=(width / 2, height / 2))

    window.blit(image, image_rect)
    pygame.display.update()

    pygame.time.delay(duration)

def snake_game():
    game_over = False
    game_quit = False

    # Initial position of the snake
    x1, y1 = width / 2, height / 2
    # Initial movement direction of the snake
    x1_change, y1_change = 0, 0

    # Create the initial snake
    snake = []
    snake_length = 1

    # Initial position of the food
    food_x, food_y = round(random.randrange(0, width - block_size) / block_size) * block_size,                      round(random.randrange(0, height - block_size) / block_size) * block_size

    # Main game loop
    while not game_quit:
        while game_over:
            window.blit(game_over_bg, (0, 0))
            game_over_font = pygame.font.SysFont(None, font_size)
            game_over_text = game_over_font.render("#NIEMANDBLIJFTOVER", True, WHITE)
            window.blit(game_over_text, [width / 6, height / 3])
            pygame.display.update()

            # Play game over sound effect
            game_over_sound.play()

            # Check for events to restart or quit the game
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        game_quit = True
                        game_over = False
                    if event.key == pygame.K_c:
                        snake_game()

        # Move the snake
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                game_quit = True
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_LEFT:
                    x1_change = -block_size
                    y1_change = 0
                elif event.key == pygame.K_RIGHT:
                    x1_change = block_size
                    y1_change = 0
                elif event.key == pygame.K_UP:
                    y1_change = -block_size
                    x1_change = 0
                elif event.key == pygame.K_DOWN:
                    y1_change = block_size
                    x1_change = 0

        # Update the snake's position
        if 0 <= x1 + x1_change < width and 0 <= y1 + y1_change < height:
            x1 += x1_change
            y1 += y1_change
        else:
            game_over = True

        # Clear the window
        window.blit(main_game_bg, (0, 0))

        # Create a transparent surface for the food
        food_surface = pygame.Surface((block_size, block_size), pygame.SRCALPHA)
        pygame.draw.rect(food_surface, TRANSPARENT, (0, 0, block_size, block_size))
        window.blit(food_surface, (food_x, food_y))

        # Update the snake's position
        snake.append([x1, y1])
        if len(snake) > snake_length:
            del snake[0]

        # Check for snake collision with itself
        for segment in snake[:-1]:
            if segment == [x1, y1]:
                game_over = True

        # Draw the snake
        for segment in snake:
            window.blit(logo_img, (segment[0], segment[1]))

        # Draw food
        window.blit(logo_img, (food_x, food_y))

        # Update the display
        pygame.display.update()

        # Check if the snake eats the food
        if x1 == food_x and y1 == food_y:
            food_x, food_y = round(random.randrange(0, width - block_size) / block_size) * block_size,                              round(random.randrange(0, height - block_size) / block_size) * block_size
            snake_length += 1
            food_sound.play()  # Play the food sound effect

            # Show the image for 3 seconds
            show_image(logo_img2, 3000)

        # Set the snake movement speed
        pygame.time.Clock().tick(snake_speed)

    # Stop the background music
    pygame.mixer.music.stop()

    # Play the game over sound effect
    game_over_sound.play()

    # Quit Pygame
    pygame.quit()


# Run the game
snake_game()

