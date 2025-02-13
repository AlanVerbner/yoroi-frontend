Feature: Transfer Yoroi Wallet funds

  Background:
    Given I have opened the extension
    And I have completed the basic setup
    Then I should see the Create wallet screen

  @it-114
  Scenario: Yoroi transfer fails when user transfers from an empty wallet (IT-114)
    Given I import a snapshot named empty-wallet
    And I am on the Yoroi Transfer start screen
    And I should see the "CREATE YOROI WALLET" button disabled
    When I click on the next button on the Yoroi Transfer start screen
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | remind style lunch result accuse upgrade atom eight limit glance frequent eternal fashion borrow monster |
    And I proceed with the recovery
    Then I should see the Yoroi transfer error screen
  
  @it-111
  Scenario: User can transfer funds from another Yoroi wallet (IT-111)
    # The recovery phrase and its balance(s) are defined in 
    # /features/mock-chain/TestWallets.js and
    # /features/mock-chain/mockImporter.js
    Given I import a snapshot named empty-wallet
    And I am on the Yoroi Transfer start screen
    When I click on the next button on the Yoroi Transfer start screen
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | dragon mango general very inmate idea rabbit pencil element bleak term cart critic kite pill |
    And I proceed with the recovery
    Then I should see on the Yoroi transfer summary screen:
    | fromAddress                                                 | amount           |   
    | Ae2tdPwUPEYx2dK1AMzRN1GqNd2eY7GCd7Z6aikMPJL3EkqqugoFQComQnV | 1234567898765    |
    When I confirm Yoroi transfer funds
    Then I should see the Yoroi transfer success screen
    
  @it-112
  Scenario: Yoroi transfer should be disabled when user hasn't created a wallet
    And I am on the Yoroi Transfer start screen
    Then I should see the next button on the Yoroi transfer start screen disabled
    When I click on the create Yoroi wallet button
    Then I should see the Create wallet screen

  @it-113
  Scenario: Wallet changes after transaction is generated (IT-113)
    Given I import a snapshot named empty-wallet
    And I am on the Yoroi Transfer start screen
    When I click on the next button on the Yoroi Transfer start screen
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | dragon mango general very inmate idea rabbit pencil element bleak term cart critic kite pill |
    And I proceed with the recovery
    Then I should see on the Yoroi transfer summary screen:
    | fromAddress                                                 | amount           |   
    | Ae2tdPwUPEYx2dK1AMzRN1GqNd2eY7GCd7Z6aikMPJL3EkqqugoFQComQnV | 1234567898765    |
    Then I transfer some Ada out of the source wallet
    | fromAddress                                                 | amount     |   
    | Ae2tdPwUPEYx2dK1AMzRN1GqNd2eY7GCd7Z6aikMPJL3EkqqugoFQComQnV | 1000000000 |
    When I confirm Yoroi transfer funds
    Then I should see wallet changed notice
    And I should see on the Yoroi transfer summary screen:
    | fromAddress                                                 | amount           |
    | Ae2tdPwUPEYx2dK1AMzRN1GqNd2eY7GCd7Z6aikMPJL3EkqqugoFQComQnV | 1233567898765    |
    When I confirm Yoroi transfer funds
    Then I should see the Yoroi transfer success screen

  @it-115
  Scenario: Transfer UI should be reset when user leaves the transfer page (IT-115)
    Given I import a snapshot named empty-wallet
    And I am on the Yoroi Transfer start screen
    When I click on the next button on the Yoroi Transfer start screen
    And I enter the recovery phrase:
    | recoveryPhrase                                                                                           |
    | dragon mango general very inmate idea rabbit pencil element bleak term cart critic kite pill |
    And I proceed with the recovery
    Then I should see on the Yoroi transfer summary screen:
    | fromAddress                                                 | amount           |
    | Ae2tdPwUPEYx2dK1AMzRN1GqNd2eY7GCd7Z6aikMPJL3EkqqugoFQComQnV | 1234567898765    |
    Then I navigate to wallet transactions screen
    Then I am on the Yoroi Transfer start screen