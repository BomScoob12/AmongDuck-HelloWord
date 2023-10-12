function playerMove(player, normalSpeed, flipLeft) {
  const cursors = this.input.keyboard.createCursorKeys();
  let velocityX = 0;
  let velocityY = 0;
  if (cursors.left.isDown) {
    velocityX = -normalSpeed;
    if (flipLeft === true) {
      player.setFlipX(true);
    } else {
      player.setFlipX(false);
    }
  } else if (cursors.right.isDown) {
    velocityX = normalSpeed;
    if (flipLeft === true) {
      player.setFlipX(false);
    } else {
      player.setFlipX(true);
    }
  }

  if (cursors.up.isDown) {
    velocityY = -normalSpeed;
  } else if (cursors.down.isDown) {
    velocityY = normalSpeed;
  }

  const twoDimentionalSpeed = normalSpeed / Math.sqrt(2);
  // Check for diagonal movement
  if (cursors.left.isDown && cursors.up.isDown) {
    velocityX = -twoDimentionalSpeed;
    velocityY = -twoDimentionalSpeed;
  } else if (cursors.left.isDown && cursors.down.isDown) {
    velocityX = -twoDimentionalSpeed;
    velocityY = twoDimentionalSpeed;
  } else if (cursors.right.isDown && cursors.up.isDown) {
    velocityX = twoDimentionalSpeed;
    velocityY = -twoDimentionalSpeed;
  } else if (cursors.right.isDown && cursors.down.isDown) {
    velocityX = twoDimentionalSpeed;
    velocityY = twoDimentionalSpeed;
  }

  player.setVelocity(velocityX, velocityY);
  player.anims.play('walk', velocityX !== 0 || velocityY !== 0);
}

export default playerMove;
