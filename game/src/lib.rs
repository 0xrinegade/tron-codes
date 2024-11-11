use turbo::prelude::*;

#[derive(Default)]
struct GameState {
    player_pos: (i32, i32),
    direction: (i32, i32),
    trail: Vec<(i32, i32)>,
}

#[no_mangle]
fn init() -> GameState {
    GameState {
        player_pos: (64, 64),
        direction: (1, 0),
        trail: Vec::new(),
    }
}

#[no_mangle]
fn update(state: &mut GameState) {
    // Store current position in trail
    state.trail.push(state.player_pos);

    // Update player position based on direction
    state.player_pos.0 += state.direction.0;
    state.player_pos.1 += state.direction.1;

    // Handle input
    if gamepad(0).up.pressed() && state.direction.1 != 1 {
        state.direction = (0, -1);
    } else if gamepad(0).down.pressed() && state.direction.1 != -1 {
        state.direction = (0, 1);
    } else if gamepad(0).left.pressed() && state.direction.0 != 1 {
        state.direction = (-1, 0);
    } else if gamepad(0).right.pressed() && state.direction.0 != -1 {
        state.direction = (1, 0);
    }

    // Draw trail
    for &(x, y) in &state.trail {
        set_pixel(x, y, 0x00FFFFFF);
    }

    // Draw player
    set_pixel(state.player_pos.0, state.player_pos.1, 0x00FF00FF);
}