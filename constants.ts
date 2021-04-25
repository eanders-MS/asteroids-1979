namespace asteroids {
    /**
     * Parameters for tuning the game's look and feel.
     * 
     * **Colors**
     * Color values are palette indices. Palette reference: https://arcade.makecode.com/developer/images
     * 
     * **Angles**
     * In this game engine there are 100 angle steps in a full circle. An angle of 1 is 3.6 degrees.
     * 
     * **Fx8 values**
     * Some of the settings are numbers in "Fx8" format. Fx8 is a fixed-point format with 8 bits of precision.
     * Fixed-point numbers are a way to use integers to represent fractional values, making math operations
     * much faster on small hardware like Meowbit.
     */
    export class constants {
        /**
         * GAME
         * Things to try:
         * - Change number of lives.
         * - Change when you get an additional ship.
         * - Change how many rocks are added each level.
         */
        // How many rocks in the first wave?
        public static GAME_INITIAL_ROCKS = 3;
        // How many additional rocks each wave?
        public static GAME_ROCK_INCREMENT = 1;
        // Score for large rock.
        public static GAME_LARGE_ROCK_SCORE = 20;
        // Score for medium rock.
        public static GAME_MEDIUM_ROCK_SCORE = 50;
        // Score for small rock.
        public static GAME_SMALL_ROCK_SCORE = 100;
        // Large saucer score.
        public static GAME_LARGE_SAUCER_SCORE = 200;
        // Small saucer score.
        public static GAME_SMALL_SAUCER_SCORE = 1000;
        // Extra life at increments of.
        public static GAME_EXTRA_LIFE_EVERY = 10000;
        // Initial lives count
        public static GAME_INITIAL_LIVES = 3;

        /**
         * SHIP
         * Things to try:
         * - Make the ship bigger.
         * - Make the ship A LOT bigger.
         * - Make the ship blue.
         * - Make the ship's thruster red.
         * - Make the ship faster.
         * - Add friction to the ship.
         */
        // Size of the ship. Value of 1 is actual size.
        public static SHIP_SCALE = Fx8(0.7);
        // Speed of ship rotation. In angle steps per sec.
        // In this game engine there are 100 angle steps in a full circle.
        public static SHIP_ROTATION_SPEED = 1.5;
        // Ship acceleration.
        public static SHIP_THRUST_INCR = Fx8(0.05);
        // Ship max speed.
        public static SHIP_MAX_SPEED = Fx8(6);
        // The number of shots the ship can have out at once.
        public static SHIP_MAX_BLIPS = 20;
        // Color of the ship's body.
        public static SHIP_HULL_COLOR = 1;
        // Color of the ship's thrusters.
        public static SHIP_THRUSTER_COLOR = 1;
        // Ship friction. Value must be between 0 and 1. Value of zero means no friction.
        // Friction doesn't work correctly for very small values, like 0.005.
        // For a more controllable ship, try setting friction to 0.04 and SHIP_THRUST_INCR to 0.2.
        public static SHIP_FRICTION = Fx8(0);

        /**
         * ROCKS
         * Things to try:
         * - Experiment with rock sizes.
         * - Experiment with rock speeds.
         * - Experiment with rock split angles.
         * - Make medium-sized rocks orange.
         * - Make small rocks green.
         */
        // Size of the large rock.
        public static ROCK_SCALE_LARGE = Fx8(3);
        // Size of the medium rock.
        public static ROCK_SCALE_MEDIUM = Fx8(2);
        // Size of the small rock.
        public static ROCK_SCALE_SMALL = Fx8(1);
        // Speed of the large rock.
        public static ROCK_SPEED_LARGE = Fx8(0.2);
        // Guide speed of the medium rock (actual speed may vary).
        public static ROCK_SPEED_MEDIUM = Fx8(0.5);
        // Guide speed of the small rock (actual speed may vary).
        public static ROCK_SPEED_SMALL = Fx8(0.7);
        // Rock colors.
        public static ROCK_COLOR_LARGE = 2;
        public static ROCK_COLOR_MEDIUM = 2;
        public static ROCK_COLOR_SMALL = 2;
        // Min angle of a split rock's trajectory difference from its parent rock.
        public static ROCK_SPLIT_MIN_ANGLE = 2;
        // Max angle of a split rock's trajectory difference from its parent rock.
        public static ROCK_SPLIT_MAX_ANGLE = 20;

        /**
         * BLIPS (bullets)
         * Things to try:
         * - Tweak blip behavior, see how it changes gameplay.
         */
        // Blip speed (pixels per update -- but what is the update frequency?).
        public static BLIP_SPEED = Fx8(5);
        // Blip time-to-live (milliseconds).
        public static BLIP_LIFETIME = 400;
        // Blip color.
        public static BLIP_COLOR = 1;
        // Inherit speed from ship?
        public static BLIP_INHERIT_SHIP_SPEED = true;

        /**
         * COLOR PALETTE
         * See https://arcade.makecode.com/developer/images, "Changing the color palette at runtime" section
         * for information on how to change the colors in this buffer.
         * Palette encoding in a nutshell:
         *  - There are 16 colors in the buffer, each represented by 6 hexadecimal digits (0 to f).
         *  - Each color entry is a red-green-blue value, with two hex digits per color component where "00" is none and "ff" full strength. For example, 100% red would be "ff0000"
         *  - The first entry (color 0) will be ignored and will always be transparent. 
         * The `palette` buffer below is the Arcade default palette except color index 2 (value "eeeeee"), which represents "almost white".
         * The color "almost white" is the default color of rocks, to subtly differentiate them from the ship's 100% white color.
         */
        public static palette = hex`000000ffffffffeeeeee93c4ff8135fff609249ca378dc52003fad87f2ff8e2ec4a4839f5c406ce5cdc491463d000000`;

        /**
         * DEBUG
         * Settings to help understand how the is working.
         */
        // Draw rigid body bounds?
        // In this game engine all rigid bodies are circles.
        public static DBG_DRAW_PHYSICS = false;
        // Debug-draw color for physics-related things.
        public static DBG_DRAW_PHYSICS_COLOR = 5;
    }
}
